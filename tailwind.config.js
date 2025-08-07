/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary brand colors - Warm Soft Palette
                primary: {
                    50: '#fffdfd',   // Very light warm white
                    100: '#fff2eb',  // rgb(255, 242, 235) - Soft cream
                    200: '#ffe8cd',  // rgb(255, 232, 205) - Warm peach
                    300: '#ffd6ba',  // rgb(255, 214, 186) - Soft coral
                    400: '#ffdcdc',  // rgb(255, 220, 220) - Light pink
                    500: '#ffc4a6',  // Slightly darker coral
                    600: '#ffb08a',  // Medium coral
                    700: '#ff9c6e',  // Rich coral
                    800: '#ff8852',  // Deep coral
                    900: '#ff7436',  // Vibrant coral
                },
                // Accent colors - Complementary warm tones
                accent: {
                    50: '#fff9f5',
                    100: '#fff0e6',
                    200: '#ffe1cc',
                    300: '#ffd2b3',
                    400: '#ffc399',
                    500: '#ffb480',  // Warm orange
                    600: '#ffa566',
                    700: '#ff964d',
                    800: '#ff8733',
                    900: '#ff781a',
                },
                // Neutral colors - Warm grays
                neutral: {
                    50: '#fefefe',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
                // Success, Warning, Error colors
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
                serif: ['Georgia', 'serif'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
        },
    },
    plugins: [],
}