@php
$locale = app()->getLocale();
$dateFmt = fn ($date, $opts = []) => $date->locale($locale)->isoFormat($opts['format'] ?? 'D MMM YYYY');
@endphp

<x-app-layout>
    {{-- HERO --}}
    <section class="relative overflow-hidden pt-10 pb-20 lg:pt-14 lg:pb-24 rased-guilloche border-b border-rased-900/10">
        <div class="pointer-events-none absolute -top-36 right-0 w-[560px] h-[560px] rounded-full bg-rased-200/45 blur-3xl animate-slow-pulse"></div>
        <div class="pointer-events-none absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-gold-400/18 blur-3xl"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
                {{-- Left editorial column --}}
                <div class="lg:col-span-6">
                    <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-rased-900/12 shadow-sm text-xs font-semibold text-rased-800 mb-7">
                        <span class="relative flex h-2 w-2 shrink-0">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rased-500 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-rased-600"></span>
                        </span>
                        <span>{{ __('home.badge2') }}</span>
                    </div>

                    <h1 class="font-display text-[clamp(2.7rem,5vw,4.65rem)] font-extrabold text-rased-950 leading-[1.04] tracking-tight mb-6">
                        {{ __('home.title_line1') }}<br>
                        <span class="text-rased-600">{{ __('home.title_accent') }}</span>
                    </h1>

                    <p class="text-base sm:text-lg text-rased-900/75 leading-relaxed max-w-xl mb-9">{{ __('home.subtitle2') }}</p>

                    <div class="flex flex-wrap items-center gap-3 mb-9">
                        <a href="{{ route('articles.index') }}" class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-rased-900 text-white font-bold text-sm hover:bg-rased-800 shadow-lg shadow-rased-900/15 hover:-translate-y-0.5 transition-all">
                            <span>{{ __('home.cta_primary') }}</span>
                            <span class="text-gold-400">→</span>
                        </a>
                        <a href="{{ route('articles.create') }}" class="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white border border-rased-900/15 text-rased-950 font-bold text-sm hover:border-gold-500 hover:bg-gold-50/40 transition-all">
                            <svg class="w-4 h-4 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" /></svg>
                            <span>{{ __('home.cta_secondary') }}</span>
                        </a>
                    </div>

                    <button type="button" onclick="document.getElementById('reportage-nouakchott').scrollIntoView({behavior:'smooth'})" class="inline-flex items-center gap-3.5 p-2.5 pr-5 rounded-2xl bg-white/90 border border-rased-900/10 shadow-sm">
                        <span class="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-700 flex items-center justify-center shrink-0">▶</span>
                        <span class="text-left">
                            <span class="block text-[11px] font-bold uppercase tracking-wider text-gold-700">{{ __('home.official_broadcast') }}</span>
                            <span class="block text-xs font-semibold text-rased-950">{{ __('home.watch_report') }} →</span>
                        </span>
                    </button>
                </div>

                {{-- Right carousel column --}}
                <div class="lg:col-span-6" x-data="{ i: 0, paused: false, n: {{ max($heroSlides->count(), 1) }} }" x-init="setInterval(() => { if (!paused) i = (i + 1) % n }, 6500)" @mouseenter="paused = true" @mouseleave="paused = false">
                    <div class="relative rounded-3xl bg-white border border-rased-900/12 shadow-[0_24px_60px_-18px_rgba(13,38,33,0.18)] p-3 sm:p-4">
                        <div class="relative aspect-[16/10] rounded-2xl overflow-hidden bg-rased-950">
                            @foreach ($heroSlides as $idx => $s)
                                <img x-show="i === {{ $idx }}" x-transition.opacity.duration.500ms src="{{ asset($s->image) }}" alt="" class="absolute inset-0 w-full h-full object-cover">
                            @endforeach
                            <div class="absolute inset-0 bg-gradient-to-t from-rased-950/80 via-transparent to-transparent"></div>

                            <div class="absolute top-0 left-0 right-0 h-1 bg-white/15" x-show="!paused">
                                <div :key="i" class="h-full bg-gold-400 animate-slide-progress"></div>
                            </div>

                            <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                                @foreach ($heroSlides as $idx => $s)
                                    <span x-show="i === {{ $idx }}" class="px-3 py-1 rounded-full bg-rased-950/75 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
                                        {{ $locale === 'fr' ? $s->location_fr : $s->location_en }}
                                    </span>
                                @endforeach
                                <div class="flex items-center gap-1.5">
                                    <button type="button" @click="i = (i - 1 + n) % n" class="w-8 h-8 rounded-full bg-rased-950/75 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-white hover:text-rased-950 transition-colors">‹</button>
                                    <button type="button" @click="i = (i + 1) % n" class="w-8 h-8 rounded-full bg-rased-950/75 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-white hover:text-rased-950 transition-colors">›</button>
                                </div>
                            </div>

                            <div class="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2">
                                @foreach ($heroSlides as $idx => $s)
                                    <span x-show="i === {{ $idx }}" class="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-400 truncate">{{ $locale === 'fr' ? $s->tag_fr : $s->tag_en }}</span>
                                @endforeach
                                <div class="flex items-center gap-1.5 shrink-0">
                                    @foreach ($heroSlides as $idx => $s)
                                        <button type="button" @click="i = {{ $idx }}" :class="i === {{ $idx }} ? 'w-7 bg-gold-400' : 'w-2 bg-white/45 hover:bg-white/75'" class="h-1.5 rounded-full transition-all"></button>
                                    @endforeach
                                </div>
                            </div>
                        </div>

                        <div class="pt-5 pb-2 px-2 sm:px-3 min-h-[126px] flex gap-4 items-start">
                            @foreach ($heroSlides as $idx => $s)
                                <template x-if="i === {{ $idx }}">
                                    <div class="flex gap-4 w-full">
                                        <span class="font-display text-4xl font-extrabold text-rased-200 leading-none select-none pt-0.5">0{{ $idx + 1 }}</span>
                                        <div class="flex-1 border-l-2 border-gold-500/45 pl-4">
                                            <h2 class="font-display font-bold text-lg text-rased-950 mb-1">{{ $locale === 'fr' ? $s->title_fr : $s->title_en }}</h2>
                                            <p class="text-xs sm:text-[13px] text-rased-900/70 leading-relaxed">{{ $locale === 'fr' ? $s->caption_fr : $s->caption_en }}</p>
                                        </div>
                                    </div>
                                </template>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>

            {{-- Stats ribbon --}}
            <div class="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                @foreach ([
                    ['value' => sprintf('%02d', $stats['members']), 'label' => __('home.stat_members_label'), 'sub' => __('home.stat_members_sub'), 'href' => route('membres')],
                    ['value' => sprintf('%02d', $stats['commissions']), 'label' => __('home.stat_commissions_label'), 'sub' => __('home.stat_commissions_sub'), 'href' => route('commissions')],
                    ['value' => sprintf('%02d', $stats['articles']), 'label' => __('home.stat_articles_label'), 'sub' => __('home.stat_articles_sub'), 'href' => route('articles.index')],
                    ['value' => __('home.stat_categories_value'), 'label' => __('home.stat_categories_label'), 'sub' => __('home.stat_categories_sub'), 'href' => route('membres')],
                ] as $st)
                    <a href="{{ $st['href'] }}" class="text-left rounded-2xl bg-white/92 border border-rased-900/10 px-5 py-4 sm:py-5 shadow-sm hover:shadow-md hover:border-gold-500/45 hover:-translate-y-0.5 transition-all flex items-start gap-4">
                        <span class="font-display text-3xl sm:text-4xl font-extrabold text-rased-700 leading-none">{{ $st['value'] }}</span>
                        <div class="min-w-0">
                            <p class="font-display font-bold text-sm sm:text-base text-rased-950 leading-snug truncate">{{ $st['label'] }}</p>
                            <p class="text-[11px] sm:text-xs text-rased-900/55 mt-0.5 truncate">{{ $st['sub'] }}</p>
                        </div>
                    </a>
                @endforeach
            </div>
        </div>
    </section>

    {{-- 3 PORTAL CARDS --}}
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div class="grid md:grid-cols-3 gap-5">
            <a href="{{ route('articles.index') }}" class="group bg-white border border-rased-900/10 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-gold-500/45 hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
                        </div>
                        <span class="px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold">{{ $stats['articles'] }} {{ $locale === 'fr' ? 'dossiers actifs' : 'active calls' }}</span>
                    </div>
                    <h3 class="font-display text-xl font-bold text-rased-950 mb-2">{{ $locale === 'fr' ? 'Publications & Revue' : 'Publications & Journal' }}</h3>
                    <p class="text-sm text-rased-900/65 leading-relaxed mb-6">{{ $locale === 'fr' ? 'Articles de recherche, soumission directe de manuscrits et lancement de la Revue africaine des sciences de l’éducation.' : 'Research papers, live manuscript submission, and the African Journal of Education Sciences.' }}</p>
                </div>
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 bg-gold-50 border border-gold-400/30 px-3.5 py-2 rounded-full w-fit">{{ $locale === 'fr' ? 'Explorer & publier' : 'Explore & publish' }} →</span>
            </a>

            <a href="{{ route('commissions') }}" class="group bg-white border border-rased-900/10 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-rased-500/45 hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="w-12 h-12 rounded-2xl bg-rased-50 text-rased-700 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 2v4M15 2v4M9 10h.01M9 14h.01M9 18h.01M12.5 22H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v3.5" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 15.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" /></svg>
                        </div>
                        <span class="px-2.5 py-1 rounded-full bg-rased-50 text-rased-700 text-[11px] font-bold">{{ $stats['commissions'] }} {{ $locale === 'fr' ? 'commissions' : 'commissions' }}</span>
                    </div>
                    <h3 class="font-display text-xl font-bold text-rased-950 mb-2">{{ $locale === 'fr' ? 'Commissions permanentes' : 'Standing Commissions' }}</h3>
                    <p class="text-sm text-rased-900/65 leading-relaxed mb-6">{{ $locale === 'fr' ? 'Recherche, écoles doctorales, mobilité internationale, transformation numérique, éthique et développement institutionnel.' : 'Research, doctoral schools, international mobility, digital transformation, ethics, and sustainability.' }}</p>
                </div>
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-rased-700 bg-rased-50 border border-rased-200 px-3.5 py-2 rounded-full w-fit">{{ $locale === 'fr' ? 'Rejoindre une commission' : 'Join a commission' }} →</span>
            </a>

            <a href="{{ route('meetings.index') }}" class="group bg-white border border-rased-900/10 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/45 hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </div>
                        <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">{{ $locale === 'fr' ? 'Vidéo & Directs' : 'Video & Live' }}</span>
                    </div>
                    <h3 class="font-display text-xl font-bold text-rased-950 mb-2">{{ $locale === 'fr' ? 'Réunions & Séminaires' : 'Meetings & Seminars' }}</h3>
                    <p class="text-sm text-rased-900/65 leading-relaxed mb-6">{{ $locale === 'fr' ? 'Reportage TV officiel de Nouakchott, université d’été annuelle, séminaires en direct et inscriptions ouvertes.' : 'Official Nouakchott TV broadcast, annual Summer University, live seminars, and instant registration.' }}</p>
                </div>
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-full w-fit">{{ $locale === 'fr' ? 'Voir l’agenda & s’inscrire' : 'Open agenda & RSVP' }} →</span>
            </a>
        </div>
    </section>

    {{-- ANCRAGE CONTINENTAL — carte interactive --}}
    @php
        $hubCoords = ['MAR' => [222, 88], 'MRT' => [145, 198], 'SEN' => [128, 248]];
    @endphp
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-24">
        <p class="text-xs font-bold text-rased-600 uppercase tracking-[0.18em] mb-2">{{ $locale === 'fr' ? 'Ancrage continental interactif' : 'Interactive Continental Hub' }}</p>
        <h2 class="font-display text-3xl sm:text-4xl font-extrabold text-rased-950 leading-tight mb-10 max-w-2xl">{{ $locale === 'fr' ? 'Trois institutions fondatrices, une dynamique panafricaine' : 'Three Founding Institutions, One Pan-African Momentum' }}</h2>

        <div x-data="{ active: '{{ $hubs->first()?->country_code }}' }" class="rounded-3xl overflow-hidden border border-rased-900/10 grid lg:grid-cols-12">
            {{-- MAP --}}
            <div class="lg:col-span-7 relative p-6 sm:p-9 bg-gradient-to-br from-rased-900 via-rased-950 to-rased-950">
                <svg viewBox="0 0 540 360" class="w-full h-auto max-h-[345px] select-none">
                    <path d="M212,48 L268,42 L322,56 L368,62 L404,82 L426,122 L456,158 L442,202 L408,246 L388,308 L350,342 L316,334 L298,288 L280,248 L244,244 L204,258 L162,256 L128,248 L122,222 L138,186 L154,146 L182,102 L202,68 Z" fill="rgba(44,106,91,0.25)" stroke="rgba(188,224,214,0.3)" stroke-width="1.4" />

                    @foreach ($hubs as $h)
                        @php [$x, $y] = $hubCoords[$h->country_code] ?? [0, 0]; @endphp
                        <g @click="active = '{{ $h->country_code }}'" class="cursor-pointer">
                            <circle cx="{{ $x }}" cy="{{ $y }}" r="30" fill="url(#hubGlow)" x-show="active === '{{ $h->country_code }}'"></circle>
                            <circle cx="{{ $x }}" cy="{{ $y }}" r="8" :fill="active === '{{ $h->country_code }}' ? '#cfa952' : '#0d2621'" stroke="#cfa952" stroke-width="2"></circle>
                            <circle cx="{{ $x }}" cy="{{ $y }}" r="2.8" :fill="active === '{{ $h->country_code }}' ? '#0d2621' : '#ffffff'"></circle>
                            <text x="{{ $x + 12 }}" y="{{ $y + 4 }}" fill="#ffffff" font-size="10.5" font-weight="700" font-family="Outfit, sans-serif">{{ $h->place }}</text>
                        </g>
                    @endforeach

                    <defs>
                        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#cfa952" stop-opacity="0.48" />
                            <stop offset="100%" stop-color="#cfa952" stop-opacity="0" />
                        </radialGradient>
                    </defs>
                </svg>

                <div class="flex flex-wrap gap-2 pt-2">
                    @foreach ($hubs as $h)
                        <button type="button" @click="active = '{{ $h->country_code }}'" :class="active === '{{ $h->country_code }}' ? 'bg-gold-500 text-rased-950' : 'bg-white/10 text-white/75 border border-white/10'" class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all">
                            <span class="font-mono text-[10px] opacity-80">{{ $h->country_code }}</span>
                            {{ $locale === 'fr' ? $h->institution_fr : $h->institution_en }}
                        </button>
                    @endforeach
                </div>
            </div>

            {{-- INFO PANEL (dynamique) --}}
            <div class="lg:col-span-5 p-7 sm:p-9 bg-rased-900/90 text-white flex flex-col justify-center">
                @foreach ($hubs as $h)
                    <div x-show="active === '{{ $h->country_code }}'" x-cloak>
                        <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gold-400 mb-4">📍 {{ $h->place }}</span>
                        <h3 class="font-display text-2xl font-bold text-white leading-snug mb-3">{{ $locale === 'fr' ? $h->institution_fr : $h->institution_en }}</h3>
                        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5">
                            <p class="text-[11px] uppercase tracking-[0.14em] text-white/50 mb-1">{{ $locale === 'fr' ? 'Autorité académique signataire' : 'Signatory Academic Authority' }}</p>
                            <p class="font-display text-lg font-bold text-gold-400">{{ $h->name }}</p>
                            <p class="text-xs text-white/75 mt-0.5">{{ $locale === 'fr' ? $h->role_fr : $h->role_en }}</p>
                        </div>
                        @if ($h->tags)
                            <div>
                                <p class="text-[11px] uppercase tracking-[0.14em] text-white/50 mb-2.5">{{ $locale === 'fr' ? 'Axes d’excellence & coopération' : 'Core Research & Training Pillars' }}</p>
                                <div class="flex flex-wrap gap-2">
                                    @foreach ($h->tags as $tag)
                                        <span class="px-3 py-1 rounded-full bg-rased-800/90 border border-rased-600/50 text-xs text-rased-100">{{ $tag }}</span>
                                    @endforeach
                                </div>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    {{-- MISSIONS & CATEGORIES --}}
    <section class="bg-white border-y border-rased-900/10 py-20 lg:py-28">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-14 lg:gap-16">
            <div class="lg:col-span-7" x-data="{ active: 0 }">
                <p class="text-xs font-bold text-rased-600 uppercase tracking-[0.18em] mb-2">{{ $locale === 'fr' ? 'Charte constitutive · Le Réseau' : 'Founding Charter · Purpose' }}</p>
                <h2 class="font-display text-3xl sm:text-4xl font-extrabold text-rased-950 mb-3">{{ $locale === 'fr' ? 'Nos 7 missions statutaires' : 'Our 7 Statutory Missions' }}</h2>
                <p class="text-sm text-rased-900/65 mb-8 max-w-xl">{{ $locale === 'fr' ? 'Cliquez sur une mission pour en voir le détail.' : 'Click a mission to see its detail.' }}</p>

                <div class="space-y-2.5">
                    @foreach (__('home.missions') as $idx => $m)
                        <button type="button" @click="active = {{ $idx }}" :class="active === {{ $idx }} ? 'bg-ivory-50 border-rased-700/35 shadow-sm' : 'bg-white border-rased-900/10 hover:bg-ivory-50/60'" class="w-full p-4 rounded-2xl border text-left transition-all">
                            <div class="flex items-start gap-4">
                                <span :class="active === {{ $idx }} ? 'bg-rased-900 text-gold-400' : 'bg-rased-50 text-rased-700'" class="shrink-0 w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors mt-0.5">{{ $m['number'] }}</span>
                                <div class="flex-1">
                                    <p class="font-display font-bold text-[15px] sm:text-base text-rased-950 leading-snug">{{ $m['title'] }}</p>
                                    <p x-show="active === {{ $idx }}" x-cloak class="text-xs sm:text-sm text-rased-900/65 mt-2 leading-relaxed">{{ $m['detail'] }}</p>
                                </div>
                            </div>
                        </button>
                    @endforeach
                </div>
            </div>

            <div class="lg:col-span-5" x-data="{ cat: 0 }">
                <div class="rounded-3xl bg-ivory-50 border border-rased-900/10 p-7 sm:p-9 h-full flex flex-col justify-between">
                    <div>
                        <p class="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 uppercase tracking-[0.16em] mb-2">{{ $locale === 'fr' ? 'Navigateur des 5 catégories' : '5 Statutory Categories Explorer' }}</p>
                        <h3 class="font-display text-2xl sm:text-3xl font-extrabold text-rased-950 mb-3">{{ $locale === 'fr' ? 'Les catégories statutaires' : 'Statutory membership tiers' }}</h3>

                        <div class="flex flex-wrap gap-1.5 mb-5">
                            @foreach (__('home.categories') as $idx => $cat)
                                <button type="button" @click="cat = {{ $idx }}" :class="cat === {{ $idx }} ? 'bg-rased-900 text-white' : 'bg-white text-rased-800 border border-rased-900/10'" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors">{{ $cat['code'] }}</button>
                            @endforeach
                        </div>

                        @foreach (__('home.categories') as $idx => $cat)
                            <div x-show="cat === {{ $idx }}" x-cloak>
                                <p class="font-display font-bold text-rased-950 mb-1">{{ $cat['name'] }}</p>
                                <p class="text-sm text-rased-900/65 leading-relaxed mb-2">{{ $cat['description'] }}</p>
                                <span class="text-[11px] font-mono text-rased-900/55 bg-white px-2.5 py-0.5 rounded-md border border-rased-900/10">{{ $cat['article'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </section>

    {{-- GOUVERNANCE --}}
    <section class="border-y border-rased-900/10 bg-ivory-50 py-24">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
            <div class="max-w-2xl mb-12">
                <p class="text-xs font-bold text-rased-600 uppercase tracking-widest mb-2">{{ $locale === 'fr' ? 'Organisation' : 'Organisation' }}</p>
                <h2 class="font-display text-3xl md:text-4xl font-extrabold text-rased-950 mb-4">{{ $locale === 'fr' ? 'Gouvernance' : 'Governance' }}</h2>
                <p class="text-rased-900/65 text-sm leading-relaxed">{{ $locale === 'fr' ? 'La gouvernance du RASED s’articule autour de quatre organes statutaires (Règlement intérieur, art. 15-35).' : 'RASED’s governance is structured around four statutory bodies (Internal Regulations, art. 15-35).' }}</p>
            </div>

            <div class="grid md:grid-cols-2 gap-5">
                <div class="bg-white border border-rased-900/10 rounded-2xl shadow-sm p-7">
                    <p class="text-xs font-bold text-gold-700 uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Présidence' : 'Presidency' }}</p>
                    <p class="font-display font-bold text-rased-950 text-lg mb-1">Pr Abdellatif Kidai</p>
                    <p class="text-sm text-rased-900/65 mb-3">{{ $locale === 'fr' ? 'Doyen de la Faculté des Sciences de l’Éducation, Université Mohammed V, Rabat' : 'Dean of the Faculty of Education Sciences, Mohammed V University, Rabat' }}</p>
                    <p class="text-xs text-rased-900/55 border-t border-rased-900/10 pt-3">{{ $locale === 'fr' ? 'Mandat de 2 ans renouvelable une fois, selon un principe de rotation entre institutions membres.' : '2-year term renewable once, following a rotation principle between member institutions.' }}</p>
                </div>

                <div class="bg-white border border-rased-900/10 rounded-2xl shadow-sm p-7">
                    <p class="text-xs font-bold text-gold-700 uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Vice-présidences' : 'Vice-Presidencies' }}</p>
                    <p class="font-display font-bold text-rased-950 text-lg mb-1">{{ $locale === 'fr' ? '3 Vice-présidents régionaux' : '3 Regional Vice-Presidents' }}</p>
                    <p class="text-sm text-rased-900/65">{{ $locale === 'fr' ? 'Un représentant par grande région assiste le Président et assure la coordination avec les institutions membres.' : 'One representative per sub-region assists the President and ensures coordination with member institutions.' }}</p>
                </div>

                <div class="bg-white border border-rased-900/10 rounded-2xl shadow-sm p-7">
                    <p class="text-xs font-bold text-gold-700 uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Organe exécutif' : 'Executive Body' }}</p>
                    <p class="font-display font-bold text-rased-950 text-lg mb-1">{{ $locale === 'fr' ? 'Comité de coordination' : 'Coordination Committee' }}</p>
                    <p class="text-sm text-rased-900/65">{{ $locale === 'fr' ? 'Président, Vice-présidents, Secrétaire général, Trésorier général et Présidents des 6 commissions. Se réunit au moins deux fois par an.' : 'President, Vice-Presidents, Secretary-General, Treasurer-General & Commission Chairs. Meets at least twice a year.' }}</p>
                </div>

                <div class="bg-white border border-rased-900/10 rounded-2xl shadow-sm p-7">
                    <div class="flex items-start gap-4 mb-1">
                        <img src="{{ asset('rased-sg-portrait.jpeg') }}" alt="Abdallahi El Kerim" class="w-12 h-12 rounded-full object-cover shrink-0 border border-rased-900/10">
                        <div>
                            <p class="text-xs font-bold text-gold-700 uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Organe administratif' : 'Administrative Body' }}</p>
                            <p class="font-display font-bold text-rased-950 text-lg leading-snug">Abdallahi El Kerim</p>
                        </div>
                    </div>
                    <p class="text-xs text-rased-900/55 mb-3">{{ $locale === 'fr' ? 'Secrétaire général · ENS de Nouakchott' : 'Secretary-General · ENS Nouakchott' }}</p>
                    <p class="text-sm text-rased-900/65">{{ $locale === 'fr' ? 'Gestion quotidienne du Réseau, conservation des archives statutaires. Directeur de la Formation et de la coopération à l’ENS de Nouakchott depuis 1988.' : 'Daily Network operations and statutory records. Director of Training and Cooperation at ENS Nouakchott since 1988.' }}</p>
                </div>
            </div>
        </div>
    </section>

    {{-- PUBLICATIONS --}}
    <section class="py-24">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
            <div class="flex items-end justify-between mb-12">
                <div>
                    <p class="text-xs font-bold text-gold-700 uppercase tracking-widest mb-2">{{ __('home.articles_label') }}</p>
                    <h2 class="font-display text-4xl font-extrabold text-rased-950">{{ __('home.recent_articles') }}</h2>
                </div>
                <a href="{{ route('articles.index') }}" class="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-gold-700 border border-gold-400/30 px-4 py-2 rounded-full hover:bg-gold-50 transition-all">{{ __('home.see_all') }} →</a>
            </div>

            @if ($listArticles->isEmpty())
                <div class="text-center py-16 text-rased-900/55">
                    <p class="font-display text-xl font-bold mb-2">{{ __('home.no_articles') }}</p>
                </div>
            @else
                <div class="grid md:grid-cols-5 gap-5">
                    <a href="{{ route('articles.show', $listArticles[0]->slug) }}" class="md:col-span-3 group bg-white border border-rased-900/10 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[260px]">
                        <div>
                            <span class="text-xs font-bold text-gold-700 uppercase tracking-widest">{{ $listArticles[0]->category ?? 'Publication' }}</span>
                            <h3 class="font-display text-2xl font-extrabold text-rased-950 mt-3 mb-2 leading-snug">{{ $listArticles[0]->title }}</h3>
                        </div>
                        <div class="flex items-center gap-3 pt-5 border-t border-rased-900/10 mt-auto">
                            <div class="w-8 h-8 rounded-full bg-rased-50 flex items-center justify-center font-display font-bold text-xs text-rased-700">
                                {{ collect(explode(' ', $listArticles[0]->author->name))->map(fn ($w) => mb_substr($w, 0, 1))->join('') }}
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-rased-950">{{ $listArticles[0]->author->name }}</p>
                                <p class="text-xs text-rased-900/55">{{ $dateFmt($listArticles[0]->created_at) }}</p>
                            </div>
                        </div>
                    </a>

                    <div class="md:col-span-2 flex flex-col gap-4">
                        @foreach ($listArticles->slice(1) as $a)
                            <a href="{{ route('articles.show', $a->slug) }}" class="group flex-1 bg-white border border-rased-900/10 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                                <div>
                                    <span class="text-xs font-bold text-gold-700 uppercase tracking-widest">{{ $a->category ?? 'Publication' }}</span>
                                    <h4 class="font-display font-bold text-rased-950 mt-2 text-base leading-snug">{{ $a->title }}</h4>
                                </div>
                                <p class="text-xs text-rased-900/55 mt-4 font-medium">{{ $a->author->name }} · {{ $dateFmt($a->created_at) }}</p>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </section>

    {{-- RÉUNIONS --}}
    <section id="reportage-nouakchott" class="bg-ivory-50 border-t border-rased-900/10 py-24">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
            <div class="flex items-end justify-between mb-12">
                <div>
                    <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">{{ __('home.meetings_label') }}</p>
                    <h2 class="font-display text-4xl font-extrabold text-rased-950">{{ __('home.agenda') }}</h2>
                </div>
                <a href="{{ route('meetings.index') }}" class="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-50 transition-all">{{ __('home.see_all') }} →</a>
            </div>

            <div class="mb-10 bg-white border border-rased-900/10 rounded-2xl shadow-sm overflow-hidden">
                <video controls preload="metadata" class="w-full aspect-video bg-black" poster="{{ asset('rased-doyen-nkc.jpeg') }}">
                    <source src="{{ asset('rased-lancement-nkc.mp4') }}" type="video/mp4">
                </video>
                <div class="px-6 py-4">
                    <p class="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">{{ __('home.official_broadcast') }}</p>
                    <p class="text-sm text-rased-900/65">{{ $locale === 'fr' ? 'Extrait de la couverture télévisée de la signature du RASED à Nouakchott, en Mauritanie.' : 'Excerpt from the TV coverage of the RASED signing ceremony in Nouakchott, Mauritania.' }}</p>
                </div>
            </div>

            @if ($listMeetings->isEmpty())
                <div class="text-center py-16 text-rased-900/55">
                    <p class="font-display text-xl font-bold mb-2">{{ __('home.no_meetings') }}</p>
                </div>
            @else
                <div class="flex flex-col gap-4">
                    @foreach ($listMeetings as $m)
                        <div class="group flex items-center gap-5 bg-white border border-rased-900/10 rounded-2xl px-6 py-5 shadow-sm hover:shadow-lg transition-all">
                            <div class="shrink-0 w-14 h-14 rounded-xl bg-ivory-100 border border-rased-900/10 flex flex-col items-center justify-center">
                                <span class="font-display text-xl font-extrabold text-rased-950 leading-none">{{ $m->scheduled_at->format('d') }}</span>
                                <span class="text-[10px] font-bold text-rased-900/55 uppercase">{{ $m->scheduled_at->locale($locale)->isoFormat('MMM') }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-display font-bold text-rased-950 text-base truncate">{{ $m->title }}</h4>
                                <p class="text-sm text-rased-900/65 mt-0.5">{{ $m->host->name }} · {{ $m->scheduled_at->format('H:i') }} GMT</p>
                            </div>
                            <div class="shrink-0 flex items-center gap-3">
                                @if ($m->status !== 'ended' && $m->google_meet_url)
                                    <a href="{{ $m->google_meet_url }}" target="_blank" rel="noopener" class="text-sm font-bold px-5 py-2.5 rounded-full bg-rased-900 text-white hover:bg-rased-800 transition-all">{{ __('home.join') }}</a>
                                @elseif ($m->recording_url)
                                    <a href="{{ $m->recording_url }}" target="_blank" rel="noopener" class="text-sm font-bold px-5 py-2.5 rounded-full border border-rased-900/15 text-rased-950 hover:border-gold-500 transition-all">{{ __('home.see_replay') }}</a>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    {{-- CTA --}}
    <section class="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div class="relative bg-rased-900 rounded-3xl overflow-hidden py-20 px-8 md:px-16 text-center">
            <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-rased-500/20 blur-3xl -mr-20 -mt-20"></div>
            <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gold-400/20 blur-3xl -ml-20 -mb-20"></div>
            <div class="relative z-10 max-w-xl mx-auto">
                <p class="text-xs font-bold text-rased-200 uppercase tracking-widest mb-4">RASED · {{ $locale === 'fr' ? 'Réseau panafricain' : 'Pan-African Network' }}</p>
                <h2 class="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                    @foreach (explode("\n", __('home.cta_title')) as $i => $line)
                        {{ $line }}@if ($i === 0)<br>@endif
                    @endforeach
                </h2>
                <p class="text-rased-200/80 text-base leading-relaxed mb-8">{{ __('home.cta_sub') }}</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="{{ route('register') }}" class="inline-block px-8 py-4 bg-gold-500 text-rased-950 rounded-full font-bold text-base hover:bg-gold-400 hover:-translate-y-0.5 transition-all">{{ $locale === 'fr' ? 'Adhérer au réseau RASED' : 'Join the RASED network' }}</a>
                    <a href="{{ route('articles.create') }}" class="inline-block px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-bold text-base hover:bg-white/15 transition-all">{{ $locale === 'fr' ? 'Soumettre une publication' : 'Submit a publication' }}</a>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
