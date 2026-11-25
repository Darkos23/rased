<?php

use App\Http\Controllers\ProfileController;
use App\Models\Article;
use App\Models\Course;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $articles = Article::with('author:id,name,avatar')
        ->where('status', 'published')
        ->latest()
        ->take(4)
        ->get();

    $meetings = Meeting::with('host:id,name,avatar')
        ->orderByRaw("CASE WHEN status = 'live' THEN 0 WHEN status = 'scheduled' THEN 1 ELSE 2 END")
        ->orderBy('scheduled_at')
        ->take(4)
        ->get();

    $stats = [
        'articles' => Article::where('status', 'published')->count(),
        'meetings' => Meeting::count(),
        'members' => \App\Models\Member::count(),
        'commissions' => \App\Models\Commission::count(),
    ];

    $heroArticle = $articles->first();
    $heroMeeting = $meetings->firstWhere('status', 'scheduled') ?? $meetings->first();

    $listArticles = $heroArticle ? $articles->reject(fn ($a) => $a->id === $heroArticle->id)->values() : $articles;
    $listMeetings = $heroMeeting ? $meetings->reject(fn ($m) => $m->id === $heroMeeting->id)->values() : $meetings;

    $heroSlides = \App\Models\HeroSlide::orderBy('order')->get();

    return view('home', compact('heroArticle', 'heroMeeting', 'listArticles', 'listMeetings', 'stats', 'heroSlides'));
})->name('home');

Route::get('/lang/{locale}', function (string $locale) {
    if (in_array($locale, ['fr', 'en'])) {
        session(['locale' => $locale]);
    }
    return back();
})->name('lang.switch');

Route::get('/membres', function () {
    $members = \App\Models\Member::orderBy('rank')->get();
    return view('membres', compact('members'));
})->name('membres');

Route::get('/commissions', function () {
    $commissions = \App\Models\Commission::orderBy('order')->get();
    return view('commissions', compact('commissions'));
})->name('commissions');

Route::get('/archives', function () {
    return view('archives');
})->name('archives');

Route::get('/articles', function (Request $request) {
    $articles = Article::with('author:id,name,avatar')
        ->where('status', 'published')
        ->when($request->category, fn ($q, $c) => $q->where('category', $c))
        ->latest()
        ->paginate(12)
        ->withQueryString();

    return view('articles.index', compact('articles'));
})->name('articles.index');

Route::get('/articles/{slug}', function (string $slug) {
    $article = Article::with('author:id,name,avatar')
        ->where('slug', $slug)
        ->where('status', 'published')
        ->firstOrFail();

    return view('articles.show', compact('article'));
})->where('slug', '.*-[a-zA-Z0-9]{5}$')->name('articles.show');

Route::get('/courses', function (Request $request) {
    $courses = Course::with('teacher:id,name,avatar')
        ->where('status', 'published')
        ->when($request->level, fn ($q, $l) => $q->where('level', $l))
        ->latest()
        ->paginate(12)
        ->withQueryString();

    return view('courses.index', compact('courses'));
})->name('courses.index');

Route::get('/courses/{slug}', function (string $slug) {
    $course = Course::with('teacher:id,name,avatar', 'lessons')
        ->where('slug', $slug)
        ->where('status', 'published')
        ->firstOrFail();

    return view('courses.show', compact('course'));
})->where('slug', '.*-[a-zA-Z0-9]{5}$')->name('courses.show');

Route::get('/meetings', function (Request $request) {
    $meetings = Meeting::with('host:id,name,avatar')
        ->when($request->status, fn ($q, $st) => $q->where('status', $st))
        ->orderByRaw("CASE WHEN status = 'live' THEN 0 WHEN status = 'scheduled' THEN 1 ELSE 2 END")
        ->orderBy('scheduled_at')
        ->paginate(20)
        ->withQueryString();

    return view('meetings.index', compact('meetings'));
})->name('meetings.index');

Route::get('/meetings/{id}', function (string $id) {
    $meeting = Meeting::with('host:id,name,avatar')->findOrFail($id);

    return view('meetings.show', compact('meeting'));
})->whereNumber('id')->name('meetings.show');

Route::get('/dashboard', function (Request $request) {
    $user = $request->user();

    $data = match ($user->role) {
        'admin' => [
            'role' => 'admin',
            'articlesCount' => Article::count(),
            'coursesCount' => Course::count(),
            'meetingsCount' => Meeting::count(),
            'researchersCount' => \App\Models\User::where('role', 'researcher')->count(),
            'teachersCount' => \App\Models\User::where('role', 'teacher')->count(),
        ],
        'teacher' => [
            'role' => 'teacher',
            'myCourses' => $user->courses()->latest()->take(5)->get(),
            'myArticles' => $user->articles()->latest()->take(5)->get(),
            'myMeetings' => $user->meetings()->orderBy('scheduled_at')->take(5)->get(),
        ],
        'researcher' => [
            'role' => 'researcher',
            'myArticles' => $user->articles()->latest()->take(5)->get(),
            'upcoming' => Meeting::where('status', 'scheduled')->orderBy('scheduled_at')->take(5)->get(),
        ],
        default => ['role' => $user->role],
    };

    return view('dashboard', $data);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/admin/users', function (Request $request) {
        abort_unless(Auth::user()->isAdmin(), 403);

        $users = \App\Models\User::query()
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->when($request->search, fn ($q, $s) => $q->where(fn ($q2) => $q2
                ->where('name', 'ilike', "%{$s}%")
                ->orWhere('email', 'ilike', "%{$s}%")))
            ->when($request->role, fn ($q, $r) => $q->where('role', $r))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.users', compact('users'));
    })->name('admin.users');

    Route::put('/admin/users/{id}/role', function (Request $request, int $id) {
        abort_unless(Auth::user()->isAdmin(), 403);

        $data = $request->validate(['role' => 'required|in:admin,teacher,researcher']);
        $target = \App\Models\User::findOrFail($id);

        abort_if($target->id === Auth::id(), 422, 'Vous ne pouvez pas modifier votre propre rôle.');

        $target->update(['role' => $data['role']]);

        return back()->with('status', 'role-updated');
    })->name('admin.users.role');

    Route::delete('/admin/users/{id}', function (int $id) {
        abort_unless(Auth::user()->isAdmin(), 403);

        $target = \App\Models\User::findOrFail($id);
        abort_if($target->id === Auth::id(), 422, 'Vous ne pouvez pas supprimer votre propre compte.');

        $target->delete();

        return back()->with('status', 'user-deleted');
    })->name('admin.users.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Articles
    Route::get('/articles/create', function (Request $request) {
        abort_unless(in_array($request->user()->role, ['admin', 'teacher']), 403);
        return view('articles.create');
    })->name('articles.create');

    Route::post('/articles', function (Request $request) {
        abort_unless(in_array($request->user()->role, ['admin', 'teacher']), 403);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category' => 'nullable|string',
            'lang' => 'in:fr,en',
            'status' => 'in:draft,published',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = asset('storage/'.$request->file('thumbnail')->store('thumbnails', 'public'));
        }

        $article = $request->user()->articles()->create([
            ...$data,
            'slug' => \Illuminate\Support\Str::slug($data['title']).'-'.\Illuminate\Support\Str::random(5),
        ]);

        return redirect()->route('articles.show', $article->slug);
    })->name('articles.store');

    Route::get('/articles/{slug}/edit', function (Request $request, string $slug) {
        $article = Article::where('slug', $slug)->firstOrFail();
        abort_unless($request->user()->id === $article->author_id || $request->user()->isAdmin(), 403);
        return view('articles.edit', compact('article'));
    })->name('articles.edit');

    Route::put('/articles/{id}', function (Request $request, int $id) {
        $article = Article::findOrFail($id);
        abort_unless($request->user()->id === $article->author_id || $request->user()->isAdmin(), 403);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'category' => 'nullable|string',
            'lang' => 'in:fr,en',
            'status' => 'in:draft,published',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = asset('storage/'.$request->file('thumbnail')->store('thumbnails', 'public'));
        }

        $article->update($data);

        return redirect()->route('articles.show', $article->slug);
    })->name('articles.update');

    Route::delete('/articles/{id}', function (Request $request, int $id) {
        $article = Article::findOrFail($id);
        abort_unless($request->user()->id === $article->author_id || $request->user()->isAdmin(), 403);
        $article->delete();
        return redirect()->route('articles.index');
    })->name('articles.destroy');

    // Courses
    Route::get('/courses/create', function (Request $request) {
        abort_unless(in_array($request->user()->role, ['admin', 'teacher']), 403);
        return view('courses.create');
    })->name('courses.create');

    Route::post('/courses', function (Request $request) {
        abort_unless(in_array($request->user()->role, ['admin', 'teacher']), 403);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'in:beginner,intermediate,advanced',
            'status' => 'in:draft,published',
            'thumbnail' => 'nullable|image|max:2048',
            'lessons' => 'array',
            'lessons.*.title' => 'required|string|max:255',
            'lessons.*.content' => 'nullable|string',
            'lessons.*.video_url' => 'nullable|string',
            'lessons.*.duration_min' => 'nullable|integer',
        ]);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = asset('storage/'.$request->file('thumbnail')->store('thumbnails', 'public'));
        }

        $lessons = $data['lessons'] ?? [];
        unset($data['lessons']);

        $course = $request->user()->courses()->create([
            ...$data,
            'slug' => \Illuminate\Support\Str::slug($data['title']).'-'.\Illuminate\Support\Str::random(5),
        ]);

        foreach ($lessons as $i => $lesson) {
            $course->lessons()->create([...$lesson, 'order' => $i]);
        }

        return redirect()->route('courses.show', $course->slug);
    })->name('courses.store');

    Route::get('/courses/{slug}/edit', function (Request $request, string $slug) {
        $course = Course::with('lessons')->where('slug', $slug)->firstOrFail();
        abort_unless($request->user()->id === $course->teacher_id || $request->user()->isAdmin(), 403);
        return view('courses.edit', compact('course'));
    })->name('courses.edit');

    Route::put('/courses/{id}', function (Request $request, int $id) {
        $course = Course::findOrFail($id);
        abort_unless($request->user()->id === $course->teacher_id || $request->user()->isAdmin(), 403);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'level' => 'in:beginner,intermediate,advanced',
            'status' => 'in:draft,published',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = asset('storage/'.$request->file('thumbnail')->store('thumbnails', 'public'));
        }

        $course->update($data);

        return redirect()->route('courses.show', $course->slug);
    })->name('courses.update');

    Route::delete('/courses/{id}', function (Request $request, int $id) {
        $course = Course::findOrFail($id);
        abort_unless($request->user()->id === $course->teacher_id || $request->user()->isAdmin(), 403);
        $course->delete();
        return redirect()->route('courses.index');
    })->name('courses.destroy');

    // Meetings
    Route::get('/meetings/create', function (Request $request) {
        abort_unless(in_array($request->user()->role, ['admin', 'teacher']), 403);
        return view('meetings.create');
    })->name('meetings.create');

    Route::post('/meetings', function (Request $request) {
        abort_unless(in_array($request->user()->role, ['admin', 'teacher']), 403);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'scheduled_at' => 'required|date',
        ]);

        $meeting = $request->user()->meetings()->create($data);

        return redirect()->route('meetings.show', $meeting->id);
    })->name('meetings.store');

    Route::get('/meetings/{id}/edit', function (Request $request, int $id) {
        $meeting = Meeting::findOrFail($id);
        abort_unless($request->user()->id === $meeting->host_id || $request->user()->isAdmin(), 403);
        return view('meetings.edit', compact('meeting'));
    })->name('meetings.edit');

    Route::put('/meetings/{id}', function (Request $request, int $id) {
        $meeting = Meeting::findOrFail($id);
        abort_unless($request->user()->id === $meeting->host_id || $request->user()->isAdmin(), 403);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'scheduled_at' => 'sometimes|date',
            'status' => 'in:scheduled,live,ended',
        ]);

        $meeting->update($data);

        return redirect()->route('meetings.show', $meeting->id);
    })->name('meetings.update');

    Route::delete('/meetings/{id}', function (Request $request, int $id) {
        $meeting = Meeting::findOrFail($id);
        abort_unless($request->user()->id === $meeting->host_id || $request->user()->isAdmin(), 403);
        $meeting->delete();
        return redirect()->route('meetings.index');
    })->name('meetings.destroy');
});

require __DIR__.'/auth.php';
