@php $locale = app()->getLocale(); @endphp

<x-app-layout>
    <div x-data="{ flipped: {}, filter: 'all' }">
        {{-- HERO --}}
        <section class="relative overflow-hidden bg-rased-950 text-white pt-14 pb-16 rased-guilloche">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-gold-400 mb-5">{{ __('members.badge2') }}</p>
                        <h1 class="font-display text-4xl md:text-5xl font-extrabold mb-4">{{ __('members.title2') }}</h1>
                        <p class="text-rased-100/80 max-w-lg">{{ __('members.subtitle2') }}</p>
                    </div>
                    <div class="rounded-2xl overflow-hidden border border-white/10">
                        <img src="{{ asset('rased-doyen-nkc.jpeg') }}" alt="" class="w-full aspect-video object-cover">
                    </div>
                </div>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {{-- FILTERS --}}
            <div class="flex flex-wrap gap-2 mb-10">
                <button type="button" @click="filter = 'all'" :class="filter === 'all' ? 'bg-rased-900 text-white' : 'bg-white text-rased-800 border border-rased-900/10'" class="px-4 py-2 rounded-full text-xs font-bold transition-colors">{{ __('members.filter_all') }} ({{ $members->count() }})</button>
                <button type="button" @click="filter = 'governance'" :class="filter === 'governance' ? 'bg-rased-900 text-white' : 'bg-white text-rased-800 border border-rased-900/10'" class="px-4 py-2 rounded-full text-xs font-bold transition-colors">{{ __('members.filter_governance') }}</button>
                <button type="button" @click="filter = 'founders'" :class="filter === 'founders' ? 'bg-rased-900 text-white' : 'bg-white text-rased-800 border border-rased-900/10'" class="px-4 py-2 rounded-full text-xs font-bold transition-colors">{{ __('members.filter_founders') }}</button>
            </div>

            {{-- PASSPORT CARDS --}}
            <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
                @foreach ($members as $m)
                    @php
                        $group = in_array($m->category_fr, ['Présidence', 'Secrétariat général']) ? 'governance' : 'founders';
                    @endphp
                    <div id="membre-{{ $m->id }}" x-show="filter === 'all' || filter === '{{ $group }}'" class="passport-scene h-[420px]">
                        <div class="passport-flipper relative w-full h-full" :class="flipped[{{ $m->id }}] && 'is-flipped'">
                            {{-- FRONT --}}
                            <div class="passport-face absolute inset-0 rounded-2xl overflow-hidden bg-rased-900 text-white shadow-lg flex flex-col">
                                <div class="relative p-5 flex flex-col flex-1">
                                    <div class="flex items-start justify-between text-[10px] font-mono text-rased-200/70 mb-3">
                                        <span>{{ $m->reference_code }}</span>
                                        <span>{{ $m->coordinates_label }}</span>
                                    </div>

                                    <div class="flex items-start gap-3 mb-3">
                                        @if ($m->photo)
                                            <img src="{{ asset($m->photo) }}" alt="{{ $m->name }}" class="w-16 h-20 rounded-lg object-cover border-2 border-white/20">
                                        @else
                                            <div class="w-16 h-20 rounded-lg bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl">{{ $m->nationality_flag }}</div>
                                        @endif
                                        <div class="min-w-0">
                                            <span class="inline-block px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold uppercase tracking-wide mb-1">{{ $locale === 'fr' ? $m->category_fr : $m->category_en }}</span>
                                            <p class="font-display font-bold text-sm leading-tight">{{ $m->name }}</p>
                                        </div>
                                    </div>

                                    <p class="text-xs text-rased-100/80 leading-snug">{{ $locale === 'fr' ? $m->role_fr : $m->role_en }}</p>
                                    <p class="text-[11px] text-rased-100/55 mt-1">{{ $locale === 'fr' ? $m->institution_fr : $m->institution_en }}</p>
                                    <p class="text-[11px] text-rased-100/55">{{ $m->place }}</p>

                                    @if ($m->tags)
                                        <div class="flex flex-wrap gap-1 mt-3">
                                            @foreach ($m->tags as $tag)
                                                <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-rased-100/80">{{ $tag }}</span>
                                            @endforeach
                                        </div>
                                    @endif

                                    <p class="mt-auto pt-3 text-[9px] font-mono text-rased-200/40 tracking-widest truncate">P&lt;RASED&lt;&lt;{{ $m->country_code }}&lt;&lt;{{ strtoupper(str_replace(' ', '&lt;', str_replace(['Pr ', 'Dr '], '', $m->name))) }}</p>

                                    @if (count($m->highlights ?? []) > 0)
                                        <button type="button" @click="flipped[{{ $m->id }}] = true" class="mt-3 text-xs font-bold text-gold-400 hover:text-gold-300 transition-colors text-left">{{ __('members.flip_3d') }} →</button>
                                    @endif
                                </div>
                            </div>

                            {{-- BACK --}}
                            <div class="passport-face passport-face-back absolute inset-0 rounded-2xl overflow-hidden bg-white border border-rased-900/10 shadow-lg flex flex-col p-5">
                                <p class="text-[10px] font-mono text-rased-900/40 mb-2">{{ $m->reference_code }}</p>
                                <p class="font-display font-bold text-rased-950 mb-3">{{ $m->name }}</p>
                                <p class="text-[10px] font-bold text-gold-700 uppercase tracking-wide mb-2">{{ __('members.titles_responsibilities') }}</p>
                                <ul class="space-y-2 flex-1 overflow-y-auto">
                                    @foreach ($m->highlights ?? [] as $i => $h)
                                        <li class="flex gap-2 text-xs text-rased-900/70 leading-snug">
                                            <span class="shrink-0 font-bold text-rased-400">0{{ $i + 1 }}</span>
                                            <span>{{ $locale === 'fr' ? $h['fr'] : $h['en'] }}</span>
                                        </li>
                                    @endforeach
                                </ul>
                                <button type="button" @click="flipped[{{ $m->id }}] = false" class="mt-3 text-xs font-bold text-rased-700 hover:text-rased-900 transition-colors text-left">← {{ __('members.full_profile') }}</button>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            {{-- FOUNDING INSTITUTIONS --}}
            <div class="mt-20">
                <h2 class="font-display text-2xl font-extrabold text-rased-950 mb-6">{{ __('members.founding_institutions_title') }}</h2>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="border border-rased-900/10 rounded-xl p-5 bg-white">
                        <p class="text-xs font-bold text-gold-700 mb-1">Rabat · MAR</p>
                        <p class="text-sm font-semibold text-rased-950">Faculté des Sciences de l’Éducation · Université Mohammed V</p>
                        <p class="text-xs text-rased-900/55 mt-1">Pr Abdellatif Kidai — {{ $locale === 'fr' ? 'Présidence & Membre fondateur' : 'Presidency & Founding Member' }}</p>
                    </div>
                    <div class="border border-rased-900/10 rounded-xl p-5 bg-white">
                        <p class="text-xs font-bold text-gold-700 mb-1">Nouakchott · MRT</p>
                        <p class="text-sm font-semibold text-rased-950">École Normale Supérieure de Nouakchott</p>
                        <p class="text-xs text-rased-900/55 mt-1">Pr Mohamed Aly Louly — {{ $locale === 'fr' ? 'Secrétariat général & Membre fondateur' : 'General Secretariat & Founding Member' }}</p>
                    </div>
                    <div class="border border-rased-900/10 rounded-xl p-5 bg-white">
                        <p class="text-xs font-bold text-gold-700 mb-1">Dakar · SEN</p>
                        <p class="text-sm font-semibold text-rased-950">FASTEF · Université Cheikh Anta Diop de Dakar</p>
                        <p class="text-xs text-rased-900/55 mt-1">Pr Moustapha Sokhna — {{ $locale === 'fr' ? 'Pôle numérique & Membre fondateur' : 'Digital Hub & Founding Member' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
