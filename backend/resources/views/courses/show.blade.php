<x-app-layout>
    <div class="max-w-3xl mx-auto px-4 py-16">
        @if ($course->thumbnail)
            <img src="{{ $course->thumbnail }}" alt="" class="w-full h-64 object-cover rounded-2xl mb-8">
        @endif

        <p class="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-3">{{ $course->level }}</p>
        <h1 class="font-outfit text-3xl font-extrabold text-ui-text mb-3">{{ $course->title }}</h1>
        <p class="text-sm text-ui-muted mb-6">{{ $course->teacher->name }}</p>

        @if ($course->description)
            <p class="text-ui-text leading-relaxed mb-10">{{ $course->description }}</p>
        @endif

        @if ($course->lessons->count() > 0)
            <div class="border-t border-ui-border pt-8">
                <h2 class="font-outfit text-xl font-bold text-ui-text mb-5">{{ __('nav.courses') }}</h2>
                <ol class="space-y-3">
                    @foreach ($course->lessons->sortBy('order') as $lesson)
                        <li class="flex items-center justify-between p-4 rounded-xl border border-ui-border">
                            <span class="font-medium text-ui-text">{{ $loop->iteration }}. {{ $lesson->title }}</span>
                            @if ($lesson->duration_min)
                                <span class="text-xs text-ui-muted">{{ $lesson->duration_min }} min</span>
                            @endif
                        </li>
                    @endforeach
                </ol>
            </div>
        @endif

        @auth
            @if (auth()->id() === $course->teacher_id || auth()->user()->isAdmin())
                <div class="mt-10 pt-6 border-t border-ui-border flex gap-4">
                    <a href="{{ route('courses.edit', $course->slug) }}" class="text-sm font-bold text-accent">{{ app()->getLocale() === 'fr' ? 'Modifier' : 'Edit' }}</a>
                    <form method="POST" action="{{ route('courses.destroy', $course->id) }}" onsubmit="return confirm('{{ app()->getLocale() === 'fr' ? 'Supprimer ce cours ?' : 'Delete this course?' }}')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-sm font-bold text-red-600">{{ app()->getLocale() === 'fr' ? 'Supprimer' : 'Delete' }}</button>
                    </form>
                </div>
            @endif
        @endauth
    </div>
</x-app-layout>
