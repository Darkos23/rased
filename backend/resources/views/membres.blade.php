@php
$locale = app()->getLocale();
@endphp

<x-app-layout>
    <div x-data="{ open: null }" class="min-h-screen bg-ui-panel pt-10 pb-24">
        <div class="w-full px-4 md:px-12">
            <div class="text-center max-w-2xl mx-auto mb-6">
                <h1 class="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-3">{{ __('members.title') }}</h1>
                <p class="text-ui-muted">{{ __('members.subtitle') }}</p>
            </div>

            <p class="text-xs text-ui-muted text-center max-w-2xl mx-auto mb-16">
                {{ __('members.progressive_note') }}
            </p>

            <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
                @foreach ($members as $m)
                    <div class="relative overflow-hidden rounded-2xl border border-ui-border shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-[380px] flex flex-col">
                        <div class="absolute inset-0 bg-white"></div>
                        <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent"></div>
                        <div class="absolute inset-0 opacity-[0.05]" style="background-image: repeating-linear-gradient(115deg, #1f4a41 0px, #1f4a41 1px, transparent 1px, transparent 22px)"></div>
                        <img src="{{ asset('rased-logo.png') }}" alt="" aria-hidden="true" class="absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.22] mix-blend-multiply pointer-events-none select-none">

                        <div class="relative p-7 flex flex-col flex-1 min-h-0">
                            <div class="flex items-start justify-between gap-4 mb-6">
                                @if ($m->photo)
                                    <img src="{{ asset($m->photo) }}" alt="{{ $m->name }}" class="w-20 h-24 rounded-lg object-cover shrink-0 border-2 border-white shadow-sm">
                                @else
                                    <div class="w-20 h-24 rounded-lg bg-brand-50 border-2 border-white shadow-sm shrink-0 flex items-center justify-center">
                                        <svg class="w-9 h-9 text-brand-200" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                                        </svg>
                                    </div>
                                @endif

                                <div class="relative">
                                    <p class="text-[10px] font-bold text-accent uppercase tracking-[0.2em] text-right leading-relaxed">
                                        {{ $locale === 'fr' ? $m->category_fr : $m->category_en }}
                                    </p>
                                    @if ($m->nationality_flag)
                                        <span class="absolute left-1/2 top-full -translate-x-1/2 text-8xl opacity-[0.15] mix-blend-multiply pointer-events-none select-none leading-none" aria-hidden="true">
                                            {{ $m->nationality_flag }}
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="h-px w-10 bg-accent mb-3"></div>
                            <h3 class="font-outfit text-2xl font-extrabold text-ui-text leading-tight">{{ $m->name }}</h3>
                            <p class="text-sm text-ui-muted mt-1">{{ $locale === 'fr' ? $m->role_fr : $m->role_en }}</p>
                            @if ($m->institution_fr)
                                <p class="text-xs text-ui-muted/70 mt-1">
                                    {{ $locale === 'fr' ? $m->institution_fr : $m->institution_en }}{{ $m->place ? ' · '.$m->place : '' }}
                                </p>
                            @endif

                            @if (count($m->highlights ?? []) > 0)
                                <button
                                    type="button"
                                    @click="open = {{ $m->id }}"
                                    class="mt-auto pt-5 border-t border-ui-border text-left text-xs font-bold text-accent uppercase tracking-[0.1em] hover:opacity-70 transition-opacity cursor-pointer"
                                >
                                    {{ __('members.view_profile') }} →
                                </button>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        @foreach ($members as $m)
            @if (count($m->highlights ?? []) > 0)
                <div
                    x-show="open === {{ $m->id }}"
                    x-cloak
                    @click="open = null"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                >
                    <div @click.stop class="relative max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-white border border-ui-border shadow-xl p-8">
                        <button type="button" @click="open = null" class="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-ui-muted hover:bg-ui-bg transition-colors cursor-pointer">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div class="flex items-start gap-4 mb-6 pr-10">
                            @if ($m->photo)
                                <img src="{{ asset($m->photo) }}" alt="{{ $m->name }}" class="w-16 h-20 rounded-lg object-cover shrink-0 border-2 border-white shadow-sm">
                            @endif
                            <div>
                                <p class="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{{ $locale === 'fr' ? $m->category_fr : $m->category_en }}</p>
                                <h3 class="font-outfit text-xl font-extrabold text-ui-text leading-tight mt-1">{{ $m->name }}</h3>
                                <p class="text-sm text-ui-muted mt-0.5">{{ $locale === 'fr' ? $m->role_fr : $m->role_en }}</p>
                                <p class="text-xs text-ui-muted/70 mt-1">{{ $locale === 'fr' ? $m->institution_fr : $m->institution_en }} · {{ $m->place }}</p>
                            </div>
                        </div>

                        <ul class="space-y-3 border-t border-ui-border pt-5">
                            @foreach ($m->highlights as $h)
                                <li class="flex items-start gap-2.5 text-sm text-ui-muted leading-relaxed">
                                    <span class="flex-shrink-0 w-1 h-1 rounded-full bg-accent mt-2"></span>
                                    {{ $locale === 'fr' ? $h['fr'] : $h['en'] }}
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            @endif
        @endforeach
    </div>
</x-app-layout>
