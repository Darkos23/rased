@php $locale = app()->getLocale(); @endphp

<x-app-layout>
    <div class="max-w-6xl mx-auto px-4 py-16">
        <p class="text-xs font-bold text-rased-600 uppercase tracking-widest mb-2">{{ $locale === 'fr' ? 'Règlement intérieur, articles 53 à 55' : 'Internal Bylaws, articles 53 to 55' }}</p>
        <h1 class="font-display text-3xl md:text-4xl font-extrabold text-rased-950 mb-3">{{ __('commissions.title') }}</h1>
        <p class="text-rased-900/65 max-w-2xl mb-10">{{ __('commissions.intro') }}</p>

        {{-- Statutory composition --}}
        <div class="bg-ivory-50 border border-rased-900/10 rounded-2xl p-6 mb-12">
            <p class="text-xs font-bold text-gold-700 uppercase tracking-wide mb-4">{{ $locale === 'fr' ? 'Composition statutaire de chaque commission (mandat de 3 ans renouvelable une fois)' : 'Statutory composition of each commission (3-year term, renewable once)' }}</p>
            <div class="grid sm:grid-cols-5 gap-4">
                @foreach ([
                    [$locale === 'fr' ? 'Président(e)' : 'Chair', $locale === 'fr' ? 'Direction scientifique de la commission' : 'Scientific direction of the commission'],
                    [$locale === 'fr' ? 'Vice-président(e)' : 'Vice-Chair', $locale === 'fr' ? 'Suppléance & suivi inter-régional' : 'Deputizing & inter-regional follow-up'],
                    [$locale === 'fr' ? 'Rapporteur' : 'Rapporteur', $locale === 'fr' ? 'Synthèse des travaux & livrables' : 'Summary of work & deliverables'],
                    [$locale === 'fr' ? 'Rapporteur adjoint' : 'Deputy Rapporteur', $locale === 'fr' ? 'Appui documentaire & procès-verbaux' : 'Documentary support & minutes'],
                    [$locale === 'fr' ? '1 Représentant / institution' : '1 Representative / institution', $locale === 'fr' ? 'Désigné par chaque établissement membre' : 'Appointed by each member institution'],
                ] as [$role, $desc])
                    <div>
                        <p class="text-sm font-bold text-rased-950">{{ $role }}</p>
                        <p class="text-xs text-rased-900/55 mt-1">{{ $desc }}</p>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
            @foreach ($commissions as $i => $c)
                <div class="bg-white border border-rased-900/10 rounded-2xl shadow-sm p-7">
                    <div class="flex items-start gap-4 mb-4">
                        <span class="flex-shrink-0 w-10 h-10 rounded-full bg-rased-900 text-gold-400 text-sm font-bold flex items-center justify-center">{{ sprintf('%02d', $i + 1) }}</span>
                        <div>
                            <p class="text-[10px] font-bold text-gold-700 uppercase tracking-wide">{{ $c->code }} · {{ $locale === 'fr' ? $c->tag_fr : $c->tag_en }}</p>
                            <h2 class="font-display text-lg font-bold text-rased-950 leading-snug mt-0.5">{{ $locale === 'fr' ? $c->title_fr : $c->title_en }}</h2>
                        </div>
                    </div>
                    <ul class="space-y-2.5 mb-5">
                        @foreach (($locale === 'fr' ? $c->missions_fr : $c->missions_en) as $m)
                            <li class="flex items-start gap-2.5 text-sm text-rased-900/65 leading-relaxed">
                                <span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold-500 mt-2"></span>
                                {{ $m }}
                            </li>
                        @endforeach
                    </ul>
                    <a href="{{ route('register') }}" class="inline-flex items-center gap-1.5 text-xs font-bold text-rased-700 bg-rased-50 border border-rased-200 px-3.5 py-2 rounded-full">{{ $locale === 'fr' ? 'Rejoindre les travaux' : 'Join the work' }} →</a>
                </div>
            @endforeach
        </div>
    </div>
</x-app-layout>
