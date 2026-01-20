/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['"Titillium Web"', 'sans-serif'],
            },
            colors: {
                'neon-green': '#39FF14',
            }
        },
    },
    plugins: [],
}
