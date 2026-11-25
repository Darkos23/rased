import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
                outfit: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    50: '#eef6f4',
                    100: '#d9ece6',
                    200: '#b0d8cc',
                    400: '#5a9c8a',
                    500: '#3d8271',
                    600: '#2c6a5b',
                    700: '#1f4a41',
                    800: '#163a33',
                    900: '#0d2621',
                },
                accent: {
                    DEFAULT: '#B8923A',
                    foreground: '#ffffff',
                },
                ui: {
                    bg: '#f8fafc',
                    panel: '#ffffff',
                    border: '#e2e8f0',
                    muted: '#64748b',
                    text: '#0f172a',
                },
            },
        },
    },

    plugins: [forms, typography],
};
