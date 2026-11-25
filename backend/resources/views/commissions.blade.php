@php $locale = app()->getLocale(); @endphp

<x-app-layout>
    <div class="max-w-6xl mx-auto px-4 py-16">
        <div class="text-center max-w-2xl mx-auto mb-6">
            <h1 class="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-3">{{ __('commissions.title') }}</h1>
            <p class="text-ui-muted">{{ __('commissions.subtitle') }}</p>
        </div>

        <p class="text-xs text-ui-muted text-center max-w-2xl mx-auto mb-16">
            {{ __('commissions.intro') }}
        </p>

        <div class="grid md:grid-cols-2 gap-5">
            @foreach ($commissions as $i => $c)
                <div class="bg-white border border-ui-border rounded-2xl shadow-sm p-8">
                    <div class="flex items-start gap-4 mb-5">
                        <span class="flex-shrink-0 w-9 h-9 rounded-full bg-brand-50 text-brand-700 text-sm font-bold flex items-center justify-center">{{ $i + 1 }}</span>
                        <h2 class="font-outfit text-lg font-bold text-ui-text leading-snug pt-1">{{ $locale === 'fr' ? $c->title_fr : $c->title_en }}</h2>
                    </div>
                    <ul class="space-y-2.5">
                        @foreach (($locale === 'fr' ? $c->missions_fr : $c->missions_en) as $m)
                            <li class="flex items-start gap-2.5 text-sm text-ui-muted leading-relaxed">
                                <span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2"></span>
                                {{ $m }}
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endforeach
        </div>
    </div>
</x-app-layout>
