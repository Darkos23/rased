<x-app-layout>
    <div class="max-w-5xl mx-auto px-4 py-16">
        <div class="flex items-center justify-between mb-10">
            <h1 class="font-outfit text-3xl font-extrabold text-ui-text">{{ __('nav.courses') }}</h1>
            @auth
                @if (in_array(auth()->user()->role, ['admin', 'teacher']))
                    <a href="{{ route('courses.create') }}" class="text-sm font-bold bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition">+ {{ app()->getLocale() === 'fr' ? 'Nouveau cours' : 'New course' }}</a>
                @endif
            @endauth
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
            @forelse ($courses as $course)
                <a href="{{ route('courses.show', $course->slug) }}" class="block rounded-2xl border border-ui-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-ui-panel">
                    @if ($course->thumbnail)
                        <img src="{{ $course->thumbnail }}" alt="" class="w-full h-40 object-cover">
                    @else
                        <div class="w-full h-40 bg-brand-50"></div>
                    @endif
                    <div class="p-5">
                        <p class="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">{{ $course->level }}</p>
                        <h2 class="font-outfit text-lg font-bold text-ui-text leading-snug">{{ $course->title }}</h2>
                        <p class="text-xs text-ui-muted mt-2">{{ $course->teacher->name }}</p>
                    </div>
                </a>
            @empty
                <p class="text-ui-muted col-span-2">{{ __('members.progressive_note') }}</p>
            @endforelse
        </div>

        <div class="mt-10">{{ $courses->links() }}</div>
    </div>
</x-app-layout>
