@php $locale = app()->getLocale(); @endphp

<x-app-layout>
    {{-- HERO --}}
    <section class="relative overflow-hidden bg-rased-950 text-white pt-14 pb-16 rased-guilloche">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <p class="text-xs font-bold text-gold-400 uppercase tracking-widest mb-3">{{ $locale === 'fr' ? 'Réunions, Séminaires & Archives audiovisuelles' : 'Meetings, Seminars & Audiovisual Archives' }}</p>
            <h1 class="font-display text-4xl md:text-5xl font-extrabold mb-4">{{ $locale === 'fr' ? 'Agenda académique & Directs' : 'Academic Agenda & Live Sessions' }}</h1>
            <p class="text-rased-100/80 max-w-xl mb-8">{{ $locale === 'fr' ? 'Visionnez le reportage officiel du lancement à Nouakchott et consultez les réunions à venir du Réseau.' : 'Watch the official Nouakchott launch broadcast and browse the Network’s upcoming meetings.' }}</p>

            <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <video controls preload="metadata" class="w-full aspect-video bg-black" poster="{{ asset('rased-doyen-nkc.jpeg') }}">
                    <source src="{{ asset('rased-lancement-nkc.mp4') }}" type="video/mp4">
                </video>
                <div class="px-6 py-4">
                    <p class="text-xs font-bold text-gold-400 uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Archive officielle · Reportage TV' : 'Official Archive · TV Report' }}</p>
                    <p class="text-sm text-rased-100/70">{{ $locale === 'fr' ? 'Cérémonie officielle de signature et de lancement du RASED à Nouakchott, couverte par la télévision nationale mauritanienne.' : 'Official RASED signing and launch ceremony in Nouakchott, covered by Mauritanian national television.' }}</p>
                </div>
            </div>
        </div>
    </section>

    <div class="max-w-3xl mx-auto px-4 py-16">
        <div class="flex items-center justify-between mb-10">
            <h2 class="font-display text-2xl font-extrabold text-rased-950">{{ __('nav.meetings') }}</h2>
            @auth
                @if (in_array(auth()->user()->role, ['admin', 'teacher']))
                    <a href="{{ route('meetings.create') }}" class="text-sm font-bold bg-rased-900 text-white px-4 py-2 rounded-full hover:bg-rased-800 transition">+ {{ $locale === 'fr' ? 'Nouvelle réunion' : 'New meeting' }}</a>
                @endif
            @endauth
        </div>

        <div class="space-y-4">
            @forelse ($meetings as $meeting)
                <a href="{{ route('meetings.show', $meeting->id) }}" class="block p-5 rounded-2xl border border-rased-900/10 hover:shadow-lg transition-all duration-300 bg-white">
                    <div class="flex items-center justify-between">
                        <h3 class="font-display text-lg font-bold text-rased-950">{{ $meeting->title }}</h3>
                        <span @class([
                            'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full',
                            'bg-red-100 text-red-700' => $meeting->status === 'live',
                            'bg-rased-50 text-rased-700' => $meeting->status === 'scheduled',
                            'bg-ivory-100 text-rased-900/55' => $meeting->status === 'ended',
                        ])>{{ $meeting->status }}</span>
                    </div>
                    <p class="text-xs text-rased-900/55 mt-2">{{ $meeting->host->name }} · {{ $meeting->scheduled_at->format('d/m/Y H:i') }}</p>
                </a>
            @empty
                <p class="text-rased-900/55">{{ __('members.progressive_note') }}</p>
            @endforelse
        </div>

        <div class="mt-10">{{ $meetings->links() }}</div>
    </div>
</x-app-layout>
