<x-app-layout>
    <div class="max-w-6xl mx-auto px-4 py-16">
        <h1 class="font-outfit text-3xl font-extrabold text-ui-text mb-10">{{ __('nav.dashboard') }}</h1>

        @if ($role === 'admin')
            <div class="grid sm:grid-cols-3 md:grid-cols-5 gap-4">
                @foreach ([
                    [__('nav.articles'), $articlesCount],
                    [__('nav.courses'), $coursesCount],
                    [__('nav.meetings'), $meetingsCount],
                    [app()->getLocale() === 'fr' ? 'Chercheurs' : 'Researchers', $researchersCount],
                    [app()->getLocale() === 'fr' ? 'Enseignants' : 'Teachers', $teachersCount],
                ] as [$label, $count])
                    <div class="bg-ui-panel rounded-2xl border border-ui-border p-6">
                        <p class="text-xs font-semibold text-ui-muted uppercase tracking-wider mb-2">{{ $label }}</p>
                        <p class="font-outfit text-3xl font-bold text-ui-text">{{ $count }}</p>
                    </div>
                @endforeach
            </div>
        @elseif ($role === 'teacher')
            <div class="space-y-10">
                <div>
                    <h2 class="font-outfit text-xl font-bold text-ui-text mb-4">{{ __('nav.courses') }}</h2>
                    @forelse ($myCourses as $c)
                        <a href="{{ route('courses.show', $c->slug) }}" class="block p-4 rounded-xl border border-ui-border mb-2 hover:shadow-sm">{{ $c->title }}</a>
                    @empty
                        <p class="text-ui-muted text-sm">{{ __('members.progressive_note') }}</p>
                    @endforelse
                </div>
                <div>
                    <h2 class="font-outfit text-xl font-bold text-ui-text mb-4">{{ __('nav.articles') }}</h2>
                    @forelse ($myArticles as $a)
                        <a href="{{ route('articles.show', $a->slug) }}" class="block p-4 rounded-xl border border-ui-border mb-2 hover:shadow-sm">{{ $a->title }}</a>
                    @empty
                        <p class="text-ui-muted text-sm">{{ __('members.progressive_note') }}</p>
                    @endforelse
                </div>
                <div>
                    <h2 class="font-outfit text-xl font-bold text-ui-text mb-4">{{ __('nav.meetings') }}</h2>
                    @forelse ($myMeetings as $m)
                        <a href="{{ route('meetings.show', $m->id) }}" class="block p-4 rounded-xl border border-ui-border mb-2 hover:shadow-sm">{{ $m->title }}</a>
                    @empty
                        <p class="text-ui-muted text-sm">{{ __('members.progressive_note') }}</p>
                    @endforelse
                </div>
            </div>
        @elseif ($role === 'researcher')
            <div class="space-y-10">
                <div>
                    <h2 class="font-outfit text-xl font-bold text-ui-text mb-4">{{ __('nav.articles') }}</h2>
                    @forelse ($myArticles as $a)
                        <a href="{{ route('articles.show', $a->slug) }}" class="block p-4 rounded-xl border border-ui-border mb-2 hover:shadow-sm">{{ $a->title }}</a>
                    @empty
                        <p class="text-ui-muted text-sm">{{ __('members.progressive_note') }}</p>
                    @endforelse
                </div>
                <div>
                    <h2 class="font-outfit text-xl font-bold text-ui-text mb-4">{{ __('nav.meetings') }}</h2>
                    @forelse ($upcoming as $m)
                        <a href="{{ route('meetings.show', $m->id) }}" class="block p-4 rounded-xl border border-ui-border mb-2 hover:shadow-sm">{{ $m->title }}</a>
                    @empty
                        <p class="text-ui-muted text-sm">{{ __('members.progressive_note') }}</p>
                    @endforelse
                </div>
            </div>
        @endif
    </div>
</x-app-layout>
