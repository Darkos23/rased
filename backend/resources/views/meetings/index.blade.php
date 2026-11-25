<x-app-layout>
    <div class="max-w-3xl mx-auto px-4 py-16">
        <div class="flex items-center justify-between mb-10">
            <h1 class="font-outfit text-3xl font-extrabold text-ui-text">{{ __('nav.meetings') }}</h1>
            @auth
                @if (in_array(auth()->user()->role, ['admin', 'teacher']))
                    <a href="{{ route('meetings.create') }}" class="text-sm font-bold bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition">+ {{ app()->getLocale() === 'fr' ? 'Nouvelle réunion' : 'New meeting' }}</a>
                @endif
            @endauth
        </div>

        <div class="space-y-4">
            @forelse ($meetings as $meeting)
                <a href="{{ route('meetings.show', $meeting->id) }}" class="block p-5 rounded-2xl border border-ui-border hover:shadow-lg transition-all duration-300 bg-ui-panel">
                    <div class="flex items-center justify-between">
                        <h2 class="font-outfit text-lg font-bold text-ui-text">{{ $meeting->title }}</h2>
                        <span @class([
                            'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full',
                            'bg-red-100 text-red-700' => $meeting->status === 'live',
                            'bg-brand-50 text-brand-700' => $meeting->status === 'scheduled',
                            'bg-ui-bg text-ui-muted' => $meeting->status === 'ended',
                        ])>{{ $meeting->status }}</span>
                    </div>
                    <p class="text-xs text-ui-muted mt-2">{{ $meeting->host->name }} · {{ $meeting->scheduled_at->format('d/m/Y H:i') }}</p>
                </a>
            @empty
                <p class="text-ui-muted">{{ __('members.progressive_note') }}</p>
            @endforelse
        </div>

        <div class="mt-10">{{ $meetings->links() }}</div>
    </div>
</x-app-layout>
