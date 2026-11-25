@php
    $embedUrl = null;
    if ($meeting->recording_url) {
        if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/', $meeting->recording_url, $m)) {
            $embedUrl = 'https://www.youtube.com/embed/'.$m[1];
        } elseif (preg_match('/vimeo\.com\/(\d+)/', $meeting->recording_url, $m)) {
            $embedUrl = 'https://player.vimeo.com/video/'.$m[1];
        }
    }
@endphp

<x-app-layout>
    <div class="max-w-3xl mx-auto px-4 py-16">
        <div class="flex items-center justify-between mb-3">
            <h1 class="font-outfit text-3xl font-extrabold text-ui-text">{{ $meeting->title }}</h1>
            <span @class([
                'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full',
                'bg-red-100 text-red-700' => $meeting->status === 'live',
                'bg-brand-50 text-brand-700' => $meeting->status === 'scheduled',
                'bg-ui-bg text-ui-muted' => $meeting->status === 'ended',
            ])>{{ $meeting->status }}</span>
        </div>
        <p class="text-sm text-ui-muted mb-8">{{ $meeting->host->name }} · {{ $meeting->scheduled_at->format('d/m/Y H:i') }}</p>

        @if ($meeting->description)
            <p class="text-ui-text leading-relaxed mb-8">{{ $meeting->description }}</p>
        @endif

        @if ($embedUrl)
            <div class="aspect-video rounded-2xl overflow-hidden border border-ui-border">
                <iframe src="{{ $embedUrl }}" class="w-full h-full" allowfullscreen></iframe>
            </div>
        @elseif ($meeting->google_meet_url && in_array($meeting->status, ['scheduled', 'live']))
            <a href="{{ $meeting->google_meet_url }}" target="_blank" rel="noopener" class="inline-block bg-brand-600 text-white font-bold px-6 py-3 rounded-full hover:bg-brand-700 transition">
                {{ __('nav.meetings') }} →
            </a>
        @endif

        @auth
            @if (auth()->id() === $meeting->host_id || auth()->user()->isAdmin())
                <div class="mt-10 pt-6 border-t border-ui-border flex gap-4">
                    <a href="{{ route('meetings.edit', $meeting->id) }}" class="text-sm font-bold text-accent">{{ app()->getLocale() === 'fr' ? 'Modifier' : 'Edit' }}</a>
                    <form method="POST" action="{{ route('meetings.destroy', $meeting->id) }}" onsubmit="return confirm('{{ app()->getLocale() === 'fr' ? 'Supprimer cette réunion ?' : 'Delete this meeting?' }}')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-sm font-bold text-red-600">{{ app()->getLocale() === 'fr' ? 'Supprimer' : 'Delete' }}</button>
                    </form>
                </div>
            @endif
        @endauth
    </div>
</x-app-layout>
