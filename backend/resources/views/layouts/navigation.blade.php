@php
    $locale = app()->getLocale();
    $navArticlesCount = \App\Models\Article::where('status', 'published')->count();
    $navMembersCount = \App\Models\Member::count();
    $navCommissionsCount = \App\Models\Commission::count();

    $navItems = [
        ['active' => request()->routeIs('home'), 'href' => url('/'), 'label' => __('nav.home'), 'badge' => null],
        ['active' => request()->routeIs('articles.*'), 'href' => route('articles.index'), 'label' => $locale === 'fr' ? 'Publications' : 'Publications', 'badge' => $navArticlesCount],
        ['active' => request()->routeIs('membres'), 'href' => route('membres'), 'label' => __('nav.members'), 'badge' => $navMembersCount],
        ['active' => request()->routeIs('commissions'), 'href' => route('commissions'), 'label' => __('nav.commissions'), 'badge' => $navCommissionsCount],
        ['active' => request()->routeIs('meetings.*'), 'href' => route('meetings.index'), 'label' => $locale === 'fr' ? 'Réunions' : 'Meetings', 'badge' => null],
    ];
@endphp

<header x-data="{ open: false }" class="sticky top-0 z-40">
    {{-- Top institutional ribbon --}}
    <div class="bg-rased-950 text-white/80 border-b border-white/10 text-[11px]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-4">
            <div class="flex items-center gap-2.5 min-w-0">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shrink-0"></span>
                <span class="font-medium tracking-wide text-white/90 truncate">{{ $locale === 'fr' ? 'Réseau Africain des Sciences de l’Éducation' : 'African Network of Education Sciences' }}</span>
                <span class="hidden md:inline text-white/30">|</span>
                <span class="hidden md:inline font-serif text-gold-400/95 shrink-0">الشبكة الإفريقية لعلوم التربية</span>
            </div>
            <div class="hidden sm:flex items-center gap-3 text-white/65 shrink-0 whitespace-nowrap">
                <span>FASTEF · UCAD</span>
                <span class="text-white/25">•</span>
                <span>FSE · Rabat</span>
                <span class="text-white/25">•</span>
                <span>ENS · Nouakchott</span>
            </div>
        </div>
    </div>

    {{-- Main glassmorphic navigation bar --}}
    <nav class="relative backdrop-blur-xl border-b bg-ivory-50/90 border-rased-900/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-[68px] gap-3">
                {{-- Brand identity --}}
                <a href="{{ url('/') }}" class="flex items-center gap-2.5 text-left group shrink-0">
                    <img src="{{ asset('rased-logo.png') }}" alt="RASED" class="h-9 w-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-gold-500 transition-all duration-300">
                    <div class="leading-tight">
                        <div class="flex items-center gap-1.5">
                            <span class="font-display font-extrabold text-lg sm:text-xl tracking-tight text-rased-950 whitespace-nowrap">RASED</span>
                            <span class="hidden 2xl:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rased-50 text-rased-700 border border-rased-200 whitespace-nowrap">{{ $locale === 'fr' ? 'Officiel' : 'Official' }}</span>
                        </div>
                        <p class="text-[10px] text-rased-900/55 hidden xl:block whitespace-nowrap">{{ $locale === 'fr' ? 'Sciences de l’Éducation' : 'Education Sciences' }}</p>
                    </div>
                </a>

                {{-- Desktop pill navigation --}}
                <div class="hidden lg:flex items-center gap-0.5 bg-white/90 border border-rased-900/10 rounded-full p-1 shadow-xs shrink-0">
                    @foreach ($navItems as $item)
                        <a href="{{ $item['href'] }}" class="px-3 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-semibold transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 {{ $item['active'] ? 'bg-rased-900 text-white shadow-xs' : 'text-rased-900/70 hover:text-rased-950 hover:bg-rased-50/80' }}">
                            <span>{{ $item['label'] }}</span>
                            @if (!is_null($item['badge']))
                                <span class="text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold {{ $item['active'] ? 'bg-gold-500 text-rased-950' : 'bg-rased-100 text-rased-700' }}">{{ $item['badge'] }}</span>
                            @endif
                        </a>
                    @endforeach
                </div>

                {{-- Right actions (lg+) --}}
                <div class="hidden lg:flex items-center gap-2 shrink-0">
                    <div role="group" aria-label="Language switcher" class="h-9 inline-flex items-center bg-white border border-rased-900/12 rounded-full p-0.5 text-xs font-bold shrink-0">
                        <a href="{{ route('lang.switch', 'fr') }}" class="px-2.5 h-full rounded-full inline-flex items-center transition-colors {{ $locale === 'fr' ? 'bg-rased-100 text-rased-900' : 'text-rased-900/50 hover:text-rased-900' }}">FR</a>
                        <a href="{{ route('lang.switch', 'en') }}" class="px-2.5 h-full rounded-full inline-flex items-center transition-colors {{ $locale === 'en' ? 'bg-rased-100 text-rased-900' : 'text-rased-900/50 hover:text-rased-900' }}">EN</a>
                    </div>

                    @auth
                        <div class="relative" x-data="{ menu: false }" @click.outside="menu = false">
                            <button type="button" @click="menu = !menu" class="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-rased-50 border border-rased-200 shrink-0">
                                <span class="w-7 h-7 rounded-full bg-rased-900 text-gold-400 text-[11px] font-bold flex items-center justify-center">{{ Str::upper(Str::substr(auth()->user()->name, 0, 2)) }}</span>
                                <span class="text-xs font-bold text-rased-950 max-w-[96px] truncate">{{ auth()->user()->name }}</span>
                            </button>
                            <div x-show="menu" x-cloak x-transition class="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-rased-900/10 shadow-lg py-1.5 z-50">
                                <a href="{{ route('dashboard') }}" class="block px-4 py-2 text-sm text-rased-900/80 hover:bg-ivory-50">{{ __('nav.dashboard') }}</a>
                                <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm text-rased-900/80 hover:bg-ivory-50">{{ __('nav.profile') }}</a>
                                @if (auth()->user()->isAdmin())
                                    <a href="{{ route('admin.users') }}" class="block px-4 py-2 text-sm text-rased-900/80 hover:bg-ivory-50">{{ __('nav.admin_users') }}</a>
                                @endif
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="w-full text-left px-4 py-2 text-sm text-rased-900/80 hover:bg-ivory-50">{{ __('nav.logout') }}</button>
                                </form>
                            </div>
                        </div>
                    @else
                        <a href="{{ route('login') }}" class="h-9 px-3 rounded-full text-xs font-semibold text-rased-900/80 hover:text-rased-950 hover:bg-white inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0">
                            <span>{{ __('nav.login') }}</span>
                        </a>
                        <a href="{{ route('register') }}" class="h-9 px-4 rounded-full bg-rased-900 text-white text-xs font-bold hover:bg-rased-800 shadow-sm hover:shadow inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0">
                            <span>{{ $locale === 'fr' ? 'Adhérer' : 'Join' }}</span>
                            <span class="text-gold-400" aria-hidden="true">↗</span>
                        </a>
                    @endauth
                </div>

                {{-- Mobile controls --}}
                <div class="flex lg:hidden items-center gap-2 shrink-0">
                    <a href="{{ route('lang.switch', $locale === 'fr' ? 'en' : 'fr') }}" class="h-9 px-2.5 inline-flex items-center gap-1 rounded-full bg-white border border-rased-900/12 text-xs font-bold text-rased-900 whitespace-nowrap">
                        {{ strtoupper($locale === 'fr' ? 'en' : 'fr') }}
                    </a>
                    <button type="button" @click="open = !open" class="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-rased-900 text-white">
                        <svg x-show="!open" class="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        <svg x-show="open" x-cloak class="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
        </div>

        {{-- Mobile drawer --}}
        <div x-show="open" x-cloak class="lg:hidden border-t border-rased-900/10 bg-ivory-50 px-4 pt-3 pb-6 space-y-1.5 shadow-xl">
            @foreach ($navItems as $item)
                <a href="{{ $item['href'] }}" class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold {{ $item['active'] ? 'bg-rased-900 text-white' : 'text-rased-900/80 hover:bg-white' }}">
                    <span>{{ $item['label'] }}</span>
                    @if (!is_null($item['badge']))
                        <span class="px-2 py-0.5 rounded-full text-xs bg-gold-500 text-rased-950 font-bold">{{ $item['badge'] }}</span>
                    @endif
                </a>
            @endforeach

            <div class="pt-3 mt-3 border-t border-rased-900/10 grid grid-cols-2 gap-2.5">
                @auth
                    <a href="{{ route('dashboard') }}" class="h-10 px-4 rounded-xl border border-rased-900/15 bg-white text-xs font-bold text-rased-900 whitespace-nowrap inline-flex items-center justify-center">{{ __('nav.dashboard') }}</a>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="w-full h-10 px-4 rounded-xl bg-rased-900 text-white text-xs font-bold whitespace-nowrap">{{ __('nav.logout') }}</button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="h-10 px-4 rounded-xl border border-rased-900/15 bg-white text-xs font-bold text-rased-900 whitespace-nowrap inline-flex items-center justify-center">{{ __('nav.login') }}</a>
                    <a href="{{ route('register') }}" class="h-10 px-4 rounded-xl bg-rased-900 text-white text-xs font-bold whitespace-nowrap inline-flex items-center justify-center">{{ $locale === 'fr' ? 'Adhérer' : 'Join' }}</a>
                @endauth
            </div>
        </div>
    </nav>
</header>
