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
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                cream: {
                    DEFAULT: '#FFF8E7',
                    light: '#FFFBF2',
                },
                navy: {
                    DEFAULT: '#003049',
                    light: '#0A4A6B',
                },
                marble: {
                    DEFAULT: '#669BBC',
                    light: '#8FB4CE',
                    dark: '#4A7A99',
                },
                crimson: {
                    DEFAULT: '#C1121F',
                    dark: '#780000',
                },
            },
        },
    },
    plugins: [forms],
};