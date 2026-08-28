import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Marcellus', 'serif'],
                sans: ['Instrument Sans', 'sans-serif'],
                display: ['Titan One', 'cursive'],
            },
            colors: {
                navy: { DEFAULT: '#11012e', light: '#2a0c62' },
                crimson: { DEFAULT: '#ff018f', dark: '#cc0172' },
                gold: { DEFAULT: '#ffcc00' },
                purple: { DEFAULT: '#a78bfa' },
                mauve: { 100: '#DFB6B2', 300: '#854F6C', 500: '#2a0c62', 700: '#2a0c62', 900: '#11012e' },
            },
        },
    },
    plugins: [forms],
};