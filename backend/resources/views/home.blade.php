@php
$locale = app()->getLocale();
$dateFmt = fn ($date, $opts = []) => $date->locale($locale)->isoFormat($opts['format'] ?? 'D MMM YYYY');
$heroCaptions = $locale === 'fr' ? [
    ['label' => 'Signature du réseau · Nouakchott', 'title' => 'Signature du RASED', 'body' => 'De gauche à droite : Pr Mohamed Aly Louly, directeur de l’ENS de Nouakchott (Mauritanie) ; Pr Moustapha Sokhna, doyen de la FASTEF-UCAD (Sénégal) ; Pr Abdellatif Kidai, doyen de la Faculté des Sciences de l’Éducation de l’Université Mohammed V de Rabat (Maroc).'],
    ['label' => 'Secrétariat général', 'title' => 'Abdallahi El Kerim', 'body' => 'Secrétaire général du RASED (à gauche sur la photo).'],
] : [
    ['label' => 'Network signing · Nouakchott', 'title' => 'RASED signing ceremony', 'body' => 'From left to right: Pr Mohamed Aly Louly, director of the ENS of Nouakchott (Mauritania); Pr Moustapha Sokhna, dean of FASTEF-UCAD (Senegal); Pr Abdellatif Kidai, dean of the Faculty of Educational Sciences, Mohammed V University, Rabat (Morocco).'],
    ['label' => 'Secretariat General', 'title' => 'Abdallahi El Kerim', 'body' => 'Secretary General of RASED (on the left in the photo).'],
];
@endphp

<x-app-layout>
    {{-- HERO --}}
    <section class="relative pt-16 pb-20 overflow-hidden bg-ui-panel">
        <div class="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] rounded-full bg-brand-100 mix-blend-multiply blur-3xl opacity-50"></div>
        <div class="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-accent/10 mix-blend-multiply blur-3xl opacity-40"></div>

        <div class="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-ui-border shadow-sm text-xs font-bold text-ui-muted tracking-wide mb-8">
                        <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        {{ __('home.badge') }}
                    </div>

                    <h1 class="font-outfit text-[clamp(2.8rem,5vw,5rem)] font-extrabold text-ui-text leading-[1.05] tracking-tight mb-6">
                        {{ __('home.hero1') }}<br>
                        <span class="text-brand-600">{{ __('home.hero2') }}</span>
                    </h1>

                    <p class="text-lg text-ui-muted mb-8 leading-relaxed max-w-lg">{{ __('home.subtitle') }}</p>

                    <div class="flex flex-col sm:flex-row gap-3 mb-10">
                        <a href="{{ route('articles.index') }}" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 text-white rounded-full font-bold text-sm hover:bg-brand-700 hover:-translate-y-0.5 transition-all">
                            {{ __('home.cta_explore') }}
                        </a>
                    </div>

                    @if ($stats['articles'] > 0)
                        <div class="flex flex-wrap gap-6 text-sm text-ui-muted font-medium">
                            <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-accent"></span>{{ $stats['articles'] }} {{ __('home.articles_n') }}</span>
                            @if ($stats['meetings'] > 0)
                                <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>{{ $stats['meetings'] }} {{ __('home.meetings_n') }}</span>
                            @endif
                        </div>
                    @endif
                </div>

                @if (!$heroArticle && !$heroMeeting)
                    <div class="relative hidden lg:block py-6" x-data="{ i: 0, n: {{ max($heroSlides->count(), 1) }} }" x-init="setInterval(() => i = (i + 1) % n, 6000)">
                        <div class="absolute inset-0 -z-10 flex items-center justify-center">
                            <div class="w-72 h-72 rounded-full bg-brand-50 blur-2xl opacity-70"></div>
                        </div>

                        <div class="relative z-0 w-full aspect-video rounded-2xl overflow-hidden bg-white border border-ui-border shadow-sm">
                            @foreach ($heroSlides as $idx => $s)
                                <img x-show="i === {{ $idx }}" src="{{ asset($s->image) }}" alt="" class="w-full h-full object-contain">
                            @endforeach
                        </div>

                        <div class="mt-5 px-1 min-h-[132px] flex gap-4">
                            @foreach ($heroCaptions as $idx => $c)
                                <template x-if="i === {{ $idx }}">
                                    <div class="flex gap-4">
                                        <span class="shrink-0 font-outfit text-4xl font-extrabold text-brand-100 leading-none select-none">0{{ $idx + 1 }}</span>
                                        <div class="flex-1 border-l-2 border-accent/30 pl-4">
                                            <p class="text-xs font-bold text-accent uppercase tracking-wide mb-1.5">{{ $c['label'] }}</p>
                                            <h3 class="font-outfit font-bold text-ui-text text-lg leading-snug mb-1.5">{{ $c['title'] }}</h3>
                                            <p class="text-sm text-ui-muted leading-relaxed line-clamp-3">{{ $c['body'] }}</p>
                                        </div>
                                    </div>
                                </template>
                            @endforeach
                        </div>
                    </div>
                @else
                    <div class="hidden lg:flex flex-col gap-4 py-6">
                        <div class="relative w-full aspect-[4/3]" x-data="{ i: 0, n: {{ max($heroSlides->count(), 1) }} }" x-init="setInterval(() => i = (i + 1) % n, 6000)">
                            <div class="absolute inset-0 z-0 rounded-2xl overflow-hidden bg-white border border-ui-border">
                                @foreach ($heroSlides as $idx => $s)
                                    <img x-show="i === {{ $idx }}" src="{{ asset($s->image) }}" alt="" class="w-full h-full object-cover">
                                @endforeach
                            </div>

                            @if ($heroArticle)
                                <div class="absolute z-10 -bottom-6 -right-6 w-72 bg-white rounded-2xl border border-ui-border shadow-lg p-5 -rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <div class="flex items-center justify-between mb-3">
                                        <span class="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full capitalize">{{ $heroArticle->category ?? 'Publication' }}</span>
                                        <span class="text-[10px] font-medium text-ui-muted">{{ $dateFmt($heroArticle->created_at, ['format' => 'D MMM']) }}</span>
                                    </div>
                                    <h3 class="font-outfit font-bold text-ui-text text-sm leading-snug mb-3 line-clamp-2">{{ $heroArticle->title }}</h3>
                                    <div class="flex items-center gap-2 pt-3 border-t border-ui-border">
                                        <div class="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700">
                                            {{ collect(explode(' ', $heroArticle->author->name))->map(fn ($w) => mb_substr($w, 0, 1))->join('') }}
                                        </div>
                                        <span class="text-xs text-ui-muted font-medium">{{ $heroArticle->author->name }}</span>
                                    </div>
                                </div>
                            @endif
                        </div>

                        <div class="grid grid-cols-2 gap-4 items-start mt-16">
                            @if ($heroMeeting)
                                <div class="bg-white rounded-2xl border border-ui-border shadow-lg p-5 rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <div class="flex items-center justify-between mb-3">
                                        <span class="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            {{ $heroMeeting->status === 'scheduled' ? __('home.scheduled') : __('home.live') }}
                                        </span>
                                        <span class="text-[10px] font-bold text-ui-muted">{{ $dateFmt($heroMeeting->scheduled_at, ['format' => 'D MMM']) }}</span>
                                    </div>
                                    <h3 class="font-outfit font-bold text-ui-text text-sm leading-snug mb-4 line-clamp-2">{{ $heroMeeting->title }}</h3>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-ui-muted">{{ $heroMeeting->host->name }}</span>
                                        <a href="{{ route('meetings.index') }}" class="text-xs font-bold text-white bg-brand-600 px-3 py-1.5 rounded-full hover:bg-brand-700 transition-colors">{{ __('home.join') }}</a>
                                    </div>
                                </div>
                            @endif
                            @if ($stats['articles'] > 0)
                                <div class="bg-white rounded-2xl border border-ui-border shadow-lg px-6 py-5">
                                    <p class="font-outfit text-4xl font-extrabold text-accent leading-none">{{ $stats['articles'] }}</p>
                                    <p class="text-xs text-ui-muted font-medium mt-1">{{ __('home.articles_n') }}</p>
                                </div>
                            @endif
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </section>

    {{-- MODULES --}}
    <section class="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div class="grid md:grid-cols-2 gap-5">
            <a href="{{ route('articles.index') }}" class="group bg-white border border-ui-border rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                </div>
                <h3 class="font-outfit text-xl font-bold text-ui-text mb-2 group-hover:text-accent transition-colors">{{ __('home.module_articles_title') }}</h3>
                <p class="text-ui-muted text-sm leading-relaxed mb-6">{{ __('home.module_articles_desc') }}</p>
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                    {{ $stats['articles'] > 0 ? $stats['articles'].' '.__('home.articles_n') : __('home.see_articles') }} →
                </span>
            </a>

            <a href="{{ route('meetings.index') }}" class="group bg-white border border-ui-border rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                    <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <h3 class="font-outfit text-xl font-bold text-ui-text mb-2 group-hover:text-emerald-600 transition-colors">{{ __('home.module_meetings_title') }}</h3>
                <p class="text-ui-muted text-sm leading-relaxed mb-6">{{ __('home.module_meetings_desc') }}</p>
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                    {{ $stats['meetings'] > 0 ? $stats['meetings'].' '.__('home.meetings_n') : __('home.see_meetings') }} →
                </span>
            </a>
        </div>
    </section>

    {{-- MISSIONS & MEMBRES --}}
    <section class="border-t border-ui-border bg-white py-24">
        <div class="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-16">
            <div>
                <p class="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">{{ $locale === 'fr' ? 'Le réseau' : 'The network' }}</p>
                <h2 class="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-8">{{ $locale === 'fr' ? 'Nos missions' : 'Our missions' }}</h2>
                <ul class="space-y-4">
                    @foreach (($locale === 'fr' ? [
                        'Renforcer la coopération scientifique entre institutions africaines en sciences de l’éducation',
                        'Consolider la gouvernance et les orientations stratégiques du réseau',
                        'Lancer des projets de recherche collaboratifs entre institutions membres',
                        'Développer des écoles doctorales communes',
                        'Organiser une université d’été annuelle',
                        'Faciliter l’adhésion de nouvelles institutions partenaires',
                        'Rayonner comme espace africain de référence en sciences de l’éducation',
                    ] : [
                        'Strengthen scientific cooperation between African institutions in educational sciences',
                        'Consolidate the network’s governance and strategic direction',
                        'Launch collaborative research projects between member institutions',
                        'Develop joint doctoral schools',
                        'Organize an annual summer university',
                        'Facilitate the admission of new partner institutions',
                        'Stand as a reference African space for educational sciences',
                    ]) as $i => $mission)
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center mt-0.5">{{ $i + 1 }}</span>
                            <span class="text-sm text-ui-muted leading-relaxed">{{ $mission }}</span>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div>
                <p class="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">{{ $locale === 'fr' ? '5 catégories statutaires' : '5 statutory categories' }}</p>
                <h2 class="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-6">{{ $locale === 'fr' ? 'Nos membres' : 'Our members' }}</h2>

                <p class="text-xs font-bold text-ui-muted uppercase tracking-wide mb-3">{{ $locale === 'fr' ? 'Membres fondateurs' : 'Founding members' }}</p>
                <div class="space-y-3">
                    @foreach ([
                        ['name' => 'FASTEF · UCAD', 'place' => 'Dakar, Sénégal', 'person' => 'Pr Moustapha Sokhna'],
                        ['name' => $locale === 'fr' ? 'Faculté des Sciences de l’Éducation · Université Mohammed V' : 'Faculty of Educational Sciences · Mohammed V University', 'place' => 'Rabat, Maroc', 'person' => 'Pr Abdellatif Kidai'],
                        ['name' => 'École Normale Supérieure', 'place' => 'Nouakchott, Mauritanie', 'person' => 'Pr Mohamed Aly Louly'],
                    ] as $inst)
                        <div class="flex items-center justify-between border border-ui-border rounded-xl px-4 py-3">
                            <div>
                                <p class="text-sm font-semibold text-ui-text">{{ $inst['name'] }}</p>
                                <p class="text-xs text-ui-muted">{{ $inst['place'] }} · {{ $inst['person'] }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>

                <p class="text-xs text-ui-muted mt-6 leading-relaxed">
                    {{ $locale === 'fr'
                        ? 'Les modalités et droits propres à chaque catégorie sont définies par les Statuts du Réseau (Règlement intérieur, art. 9-14).'
                        : 'The specific terms and rights of each category are defined by the Network’s Statutes (Internal Regulations, art. 9-14).' }}
                </p>

                <a href="{{ route('membres') }}" class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 mt-5 hover:text-brand-700 transition-colors">
                    {{ $locale === 'fr' ? 'Voir tous les membres' : 'See all members' }} →
                </a>
            </div>
        </div>
    </section>

    {{-- GOUVERNANCE --}}
    <section class="border-t border-ui-border bg-ui-panel py-24">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
            <div class="max-w-2xl mb-12">
                <p class="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">{{ $locale === 'fr' ? 'Organisation' : 'Organisation' }}</p>
                <h2 class="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-4">{{ $locale === 'fr' ? 'Gouvernance' : 'Governance' }}</h2>
                <p class="text-ui-muted text-sm leading-relaxed">
                    {{ $locale === 'fr'
                        ? 'La gouvernance du RASED s’articule autour de quatre organes statutaires (Règlement intérieur, art. 15-35).'
                        : 'RASED’s governance is structured around four statutory bodies (Internal Regulations, art. 15-35).' }}
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-5">
                <div class="bg-white border border-ui-border rounded-2xl shadow-sm p-7">
                    <p class="text-xs font-bold text-accent uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Présidence' : 'Presidency' }}</p>
                    <p class="font-outfit font-bold text-ui-text text-lg mb-1">Pr Abdellatif Kidai</p>
                    <p class="text-sm text-ui-muted mb-3">{{ $locale === 'fr' ? 'Doyen de la Faculté des Sciences de l’Éducation, Université Mohammed V, Rabat' : 'Dean of the Faculty of Educational Sciences, Mohammed V University, Rabat' }}</p>
                    <p class="text-xs text-ui-muted border-t border-ui-border pt-3">{{ $locale === 'fr' ? 'Mandat de 2 ans renouvelable une fois, selon un principe de rotation entre institutions membres.' : '2-year term renewable once, following a rotation principle between member institutions.' }}</p>
                </div>

                <div class="bg-white border border-ui-border rounded-2xl shadow-sm p-7">
                    <p class="text-xs font-bold text-accent uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Vice-présidences' : 'Vice-presidencies' }}</p>
                    <p class="font-outfit font-bold text-ui-text text-lg mb-1">{{ $locale === 'fr' ? '3 Vice-présidents' : '3 Vice-Presidents' }}</p>
                    <p class="text-sm text-ui-muted mb-3">{{ $locale === 'fr' ? 'Un représentant par grande région, assistant le Président et assurant la coordination avec les institutions membres.' : 'One representative per major region, assisting the President and coordinating with member institutions.' }}</p>
                </div>

                <div class="bg-white border border-ui-border rounded-2xl shadow-sm p-7">
                    <p class="text-xs font-bold text-accent uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Organe exécutif' : 'Executive body' }}</p>
                    <p class="font-outfit font-bold text-ui-text text-lg mb-1">{{ $locale === 'fr' ? 'Comité de coordination' : 'Coordination Committee' }}</p>
                    <p class="text-sm text-ui-muted">{{ $locale === 'fr' ? 'Président, Vice-présidents, Secrétaire général, Trésorier général et Présidents des commissions permanentes. Se réunit au moins deux fois par an.' : 'President, Vice-Presidents, Secretary General, Treasurer General and Chairs of the permanent commissions. Meets at least twice a year.' }}</p>
                </div>

                <div class="bg-white border border-ui-border rounded-2xl shadow-sm p-7">
                    <div class="flex items-start gap-4 mb-1">
                        <img src="{{ asset('rased-sg-portrait.jpeg') }}" alt="Abdallahi El Kerim" class="w-12 h-12 rounded-full object-cover shrink-0 border border-ui-border">
                        <div>
                            <p class="text-xs font-bold text-accent uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Organe administratif' : 'Administrative body' }}</p>
                            <p class="font-outfit font-bold text-ui-text text-lg leading-snug">Abdallahi El Kerim</p>
                        </div>
                    </div>
                    <p class="text-xs text-ui-muted mb-3">{{ $locale === 'fr' ? 'Secrétaire général' : 'Secretary General' }}</p>
                    <p class="text-sm text-ui-muted">{{ $locale === 'fr' ? 'Gestion quotidienne du Réseau. Le Secrétaire général est nommé par l’Assemblée générale pour un mandat de 4 ans, renouvelable une fois. Directeur de la Formation et de la coopération à l’ENS de Nouakchott depuis 1988.' : 'Day-to-day management of the Network. The Secretary General is appointed by the General Assembly for a 4-year term, renewable once. Director of Training and Cooperation at ENS Nouakchott since 1988.' }}</p>
                </div>
            </div>
        </div>
    </section>

    {{-- PUBLICATIONS --}}
    <section class="py-24">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
            <div class="flex items-end justify-between mb-12">
                <div>
                    <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">{{ __('home.articles_label') }}</p>
                    <h2 class="font-outfit text-4xl font-extrabold text-ui-text">{{ __('home.recent_articles') }}</h2>
                </div>
                <a href="{{ route('articles.index') }}" class="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-accent border border-accent/20 px-4 py-2 rounded-full hover:bg-accent/5 transition-all">{{ __('home.see_all') }} →</a>
            </div>

            @if ($listArticles->isEmpty())
                <div class="text-center py-16 text-ui-muted">
                    <p class="font-outfit text-xl font-bold mb-2">{{ __('home.no_articles') }}</p>
                </div>
            @else
                <div class="grid md:grid-cols-5 gap-5">
                    <a href="{{ route('articles.show', $listArticles[0]->slug) }}" class="md:col-span-3 group bg-white border border-ui-border rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[260px]">
                        <div>
                            <span class="text-xs font-bold text-accent uppercase tracking-widest">{{ $listArticles[0]->category ?? 'Publication' }}</span>
                            <h3 class="font-outfit text-2xl font-extrabold text-ui-text mt-3 mb-2 leading-snug group-hover:text-accent transition-colors">{{ $listArticles[0]->title }}</h3>
                        </div>
                        <div class="flex items-center gap-3 pt-5 border-t border-ui-border mt-auto">
                            <div class="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center font-outfit font-bold text-xs text-brand-700">
                                {{ collect(explode(' ', $listArticles[0]->author->name))->map(fn ($w) => mb_substr($w, 0, 1))->join('') }}
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-ui-text">{{ $listArticles[0]->author->name }}</p>
                                <p class="text-xs text-ui-muted">{{ $dateFmt($listArticles[0]->created_at) }}</p>
                            </div>
                        </div>
                    </a>

                    <div class="md:col-span-2 flex flex-col gap-4">
                        @foreach ($listArticles->slice(1) as $a)
                            <a href="{{ route('articles.show', $a->slug) }}" class="group flex-1 bg-white border border-ui-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                                <div>
                                    <span class="text-xs font-bold text-accent uppercase tracking-widest">{{ $a->category ?? 'Publication' }}</span>
                                    <h4 class="font-outfit font-bold text-ui-text mt-2 text-base leading-snug group-hover:text-accent transition-colors">{{ $a->title }}</h4>
                                </div>
                                <p class="text-xs text-ui-muted mt-4 font-medium">{{ $a->author->name }} · {{ $dateFmt($a->created_at) }}</p>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </section>

    {{-- RÉUNIONS --}}
    <section class="bg-ui-bg border-t border-ui-border py-24">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
            <div class="flex items-end justify-between mb-12">
                <div>
                    <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">{{ __('home.meetings_label') }}</p>
                    <h2 class="font-outfit text-4xl font-extrabold text-ui-text">{{ __('home.agenda') }}</h2>
                </div>
                <a href="{{ route('meetings.index') }}" class="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-50 transition-all">{{ __('home.see_all') }} →</a>
            </div>

            <div class="mb-10 bg-white border border-ui-border rounded-2xl shadow-sm overflow-hidden">
                <video controls preload="metadata" class="w-full aspect-video bg-black" poster="{{ asset('rased-doyen-nkc.jpeg') }}">
                    <source src="{{ asset('rased-lancement-nkc.mp4') }}" type="video/mp4">
                </video>
                <div class="px-6 py-4">
                    <p class="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">{{ $locale === 'fr' ? 'Reportage télévisé' : 'TV coverage' }}</p>
                    <p class="text-sm text-ui-muted">{{ $locale === 'fr' ? 'Extrait de la couverture télévisée de la signature du RASED à Nouakchott, en Mauritanie.' : 'Excerpt from the TV coverage of the RASED signing ceremony in Nouakchott, Mauritania.' }}</p>
                </div>
            </div>

            @if ($listMeetings->isEmpty())
                <div class="text-center py-16 text-ui-muted">
                    <p class="font-outfit text-xl font-bold mb-2">{{ __('home.no_meetings') }}</p>
                </div>
            @else
                <div class="flex flex-col gap-4">
                    @foreach ($listMeetings as $m)
                        <div class="group flex items-center gap-5 bg-white border border-ui-border rounded-2xl px-6 py-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            <div class="shrink-0 w-14 h-14 rounded-xl bg-ui-bg border border-ui-border flex flex-col items-center justify-center">
                                <span class="font-outfit text-xl font-extrabold text-ui-text leading-none">{{ $m->scheduled_at->format('d') }}</span>
                                <span class="text-[10px] font-bold text-ui-muted uppercase">{{ $m->scheduled_at->locale($locale)->isoFormat('MMM') }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-outfit font-bold text-ui-text text-base truncate group-hover:text-brand-600 transition-colors">{{ $m->title }}</h4>
                                <p class="text-sm text-ui-muted mt-0.5">{{ $m->host->name }} · {{ $m->scheduled_at->format('H:i') }} GMT</p>
                            </div>
                            <div class="shrink-0 flex items-center gap-3">
                                <span @class([
                                    'hidden md:block text-xs font-bold px-3 py-1 rounded-full',
                                    'bg-emerald-50 text-emerald-700' => $m->status === 'scheduled',
                                    'bg-red-50 text-red-700' => $m->status === 'live',
                                    'bg-ui-bg text-ui-muted' => $m->status === 'ended',
                                ])>
                                    {{ $m->status === 'scheduled' ? __('home.scheduled') : ($m->status === 'live' ? __('home.live') : __('home.replay')) }}
                                </span>
                                @if ($m->status !== 'ended' && $m->google_meet_url)
                                    <a href="{{ $m->google_meet_url }}" target="_blank" rel="noopener" class="text-sm font-bold px-5 py-2.5 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-all">{{ __('home.join') }}</a>
                                @elseif ($m->recording_url)
                                    <a href="{{ $m->recording_url }}" target="_blank" rel="noopener" class="text-sm font-bold px-5 py-2.5 rounded-full border border-ui-border text-ui-text hover:border-brand-400 hover:text-brand-600 transition-all">{{ __('home.see_replay') }}</a>
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
        <div class="relative bg-brand-900 rounded-3xl overflow-hidden py-20 px-8 md:px-16 text-center">
            <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl -mr-20 -mt-20"></div>
            <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/20 blur-3xl -ml-20 -mb-20"></div>
            <div class="relative z-10 max-w-xl mx-auto">
                <p class="text-xs font-bold text-brand-200 uppercase tracking-widest mb-4">RASED · Réseau panafricain</p>
                <h2 class="font-outfit text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                    @foreach (explode("\n", __('home.cta_title')) as $i => $line)
                        {{ $line }}@if ($i === 0)<br>@endif
                    @endforeach
                </h2>
                <p class="text-brand-200/80 text-base leading-relaxed mb-8">{{ __('home.cta_sub') }}</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="{{ route('articles.index') }}" class="px-8 py-4 bg-accent text-white rounded-full font-bold text-base hover:bg-accent/90 hover:-translate-y-0.5 transition-all">{{ __('home.cta_explore') }}</a>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
