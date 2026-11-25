<div
    x-data="{
        playing: false,
        muted: (() => { try { return localStorage.getItem('rased-music-muted') === '1' } catch (e) { return false } })(),
        tryStart() {
            if (this.muted) return
            this.$refs.audio.play().catch(() => {})
        },
        toggle() {
            if (this.playing) {
                this.$refs.audio.pause()
                this.muted = true
                try { localStorage.setItem('rased-music-muted', '1') } catch (e) {}
            } else {
                this.muted = false
                try { localStorage.removeItem('rased-music-muted') } catch (e) {}
                this.$refs.audio.play().catch(() => {})
            }
        },
    }"
    x-init="
        $refs.audio.addEventListener('play', () => playing = true);
        $refs.audio.addEventListener('pause', () => playing = false);
        tryStart();
        window.addEventListener('pointerdown', () => tryStart(), { once: true });
        window.addEventListener('keydown', () => tryStart(), { once: true });
    "
>
    <audio x-ref="audio" src="{{ asset('rased-ambient.mp3') }}" loop preload="auto"></audio>

    <button
        type="button"
        @click="toggle()"
        :aria-label="playing ? '{{ __('music.mute') }}' : '{{ __('music.play') }}'"
        :title="playing ? '{{ __('music.mute') }}' : '{{ __('music.play') }}'"
        class="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white border border-ui-border shadow-lg flex items-center justify-center text-ui-text hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
        <svg x-show="playing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5L6 9H2v6h4l5 4V5z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
        </svg>
        <svg x-show="!playing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5L6 9H2v6h4l5 4V5z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M23 9l-6 6M17 9l6 6" />
        </svg>
    </button>
</div>
