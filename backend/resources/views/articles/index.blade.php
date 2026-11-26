@php $locale = app()->getLocale(); @endphp

<x-app-layout>
    {{-- HERO --}}
    <section class="relative overflow-hidden bg-rased-950 text-white pt-14 pb-16 rased-guilloche">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <p class="text-xs font-bold text-gold-400 uppercase tracking-widest mb-3">{{ $locale === 'fr' ? 'Commission N° 4 · Édition scientifique officielle' : 'Commission No. 4 · Official Scientific Publishing' }}</p>
            <h1 class="font-display text-4xl md:text-5xl font-extrabold mb-4">{{ $locale === 'fr' ? 'Revue Africaine des Sciences de l’Éducation' : 'African Journal of Education Sciences' }}</h1>
            <p class="text-rased-100/80 max-w-xl mb-10">{{ $locale === 'fr' ? 'Articles de recherche, tribunes et actualités des laboratoires et institutions membres du RASED.' : 'Research articles, editorials and news from RASED member laboratories and institutions.' }}</p>

            <div class="grid md:grid-cols-3 gap-5">
                <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p class="font-display font-bold text-gold-400 mb-1">{{ $locale === 'fr' ? 'Évaluation en double aveugle' : 'Double-blind peer review' }}</p>
                    <p class="text-xs text-rased-100/65">{{ $locale === 'fr' ? 'Chaque manuscrit est instruit par deux experts indépendants issus du collège scientifique inter-universitaire du RASED.' : 'Each manuscript is reviewed by two independent experts from RASED’s inter-university scientific board.' }}</p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p class="font-display font-bold text-gold-400 mb-1">{{ $locale === 'fr' ? 'Trilinguisme académique' : 'Academic trilingualism' }}</p>
                    <p class="text-xs text-rased-100/65">{{ $locale === 'fr' ? 'Contributions originales en français, arabe et anglais accompagnées de résumés croisés.' : 'Original contributions in French, Arabic and English with cross-language abstracts.' }}</p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p class="font-display font-bold text-gold-400 mb-1">{{ $locale === 'fr' ? 'Science ouverte & Intégrité' : 'Open Science & Integrity' }}</p>
                    <p class="text-xs text-rased-100/65">{{ $locale === 'fr' ? 'Diffusion en libre accès sous l’égide des Commissions permanentes N° 4 et N° 5.' : 'Open-access publishing under the oversight of Standing Commissions No. 4 and No. 5.' }}</p>
                </div>
            </div>
        </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 py-16">
        <div class="flex items-center justify-between mb-10">
            <h2 class="font-display text-2xl font-extrabold text-rased-950">{{ __('nav.articles') }}</h2>
            @auth
                @if (in_array(auth()->user()->role, ['admin', 'teacher']))
                    <a href="{{ route('articles.create') }}" class="text-sm font-bold bg-rased-900 text-white px-4 py-2 rounded-full hover:bg-rased-800 transition">+ {{ $locale === 'fr' ? 'Nouvel article' : 'New article' }}</a>
                @endif
            @endauth
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
            @forelse ($articles as $article)
                <a href="{{ route('articles.show', $article->slug) }}" class="block rounded-2xl border border-rased-900/10 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
                    @if ($article->thumbnail)
                        <img src="{{ $article->thumbnail }}" alt="" class="w-full h-40 object-cover">
                    @else
                        <div class="w-full h-40 bg-rased-50"></div>
                    @endif
                    <div class="p-5">
                        @if ($article->category)
                            <p class="text-[10px] font-bold text-gold-700 uppercase tracking-[0.2em] mb-2">{{ $article->category }}</p>
                        @endif
                        <h3 class="font-display text-lg font-bold text-rased-950 leading-snug">{{ $article->title }}</h3>
                        <p class="text-xs text-rased-900/55 mt-2">{{ $article->author->name }} · {{ $article->created_at->format('d/m/Y') }}</p>
                    </div>
                </a>
            @empty
                <p class="text-rased-900/55 col-span-2">{{ __('nav.articles') }} — {{ __('members.progressive_note') }}</p>
            @endforelse
        </div>

        <div class="mt-10">{{ $articles->links() }}</div>
    </div>
</x-app-layout>
