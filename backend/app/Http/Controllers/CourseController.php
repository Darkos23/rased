<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::with('teacher:id,name,avatar')
            ->where('status', 'published')
            ->when($request->search, fn($q, $s) => $q->where(fn($q2) => $q2
                ->where('title',       'ilike', "%{$s}%")
                ->orWhere('description', 'ilike', "%{$s}%")))
            ->when($request->level, fn($q, $l) => $q->where('level', $l))
            ->latest()
            ->paginate(12);

        return response()->json($courses);
    }

    public function show(string $slug)
    {
        $course = Course::with('teacher:id,name,avatar', 'lessons')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($course);
    }

    public function store(Request $request)
    {
        if (! in_array($request->user()->role, ['admin', 'teacher'])) {
            abort(403);
        }

        if (! $request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Veuillez vérifier votre adresse email avant de publier.'], 403);
        }

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail'   => 'nullable|string',
            'level'       => 'in:beginner,intermediate,advanced',
            'status'      => 'in:draft,published',
        ]);

        $course = $request->user()->courses()->create([
            ...$data,
            'slug' => Str::slug($data['title']) . '-' . Str::random(5),
        ]);

        return response()->json($course, 201);
    }

    public function update(Request $request, string $id)
    {
        $course = Course::findOrFail($id);

        if ($request->user()->id !== $course->teacher_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'thumbnail'   => 'nullable|string',
            'level'       => 'in:beginner,intermediate,advanced',
            'status'      => 'in:draft,published',
        ]);

        $course->update($data);

        return response()->json($course);
    }

    public function destroy(Request $request, string $id)
    {
        $course = Course::findOrFail($id);

        if ($request->user()->id !== $course->teacher_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $course->delete();

        return response()->json(null, 204);
    }

}
