import type { Config } from "tailwindcss";
import animatePlugin from 'tailwindcss-animate';

const BRAND_VIOLET = {
	50: '#f4f1ff', 100: '#ebe5ff', 200: '#d9ceff', 300: '#bfaeff', 400: '#9c88ff',
	500: '#7f66f5', 600: '#6a4fe0', 700: '#5a3fc2', 800: '#4a359c', 900: '#3d2e7c', 950: '#251a4d',
};
const BRAND_PINK = {
	50: '#fff0f7', 100: '#ffe0ef', 200: '#ffc2df', 300: '#ff94c6', 400: '#ff4aa7',
	500: '#f02d91', 600: '#d11a78', 700: '#ab1462', 800: '#8a1552', 900: '#711646', 950: '#450526',
};
const WARM_NEUTRAL = {
	50: '#f7f5ef', 100: '#efede7', 200: '#dfdcd4', 300: '#c7c3b9', 400: '#a09c92',
	500: '#7a766d', 600: '#5a574f', 700: '#3e3c37', 800: '#262522', 900: '#161614', 950: '#0b0b0a',
};

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			'inter': ['Manrope', 'sans-serif'],
			'playfair': ['Manrope', 'sans-serif'],
			'sans': ['Manrope', 'sans-serif'],
			'serif': ['Manrope', 'sans-serif'],
			'mono': ['DM Mono', 'ui-monospace', 'monospace'],
		},
		// Full 4px scale. The half steps and 7/9/11/14… were missing before, so the ~170
		// classes that use them (including shadcn's h-9/h-11 button and input sizes) did nothing.
		spacing: {
			'0': '0',
			'0.5': '2px',
			'1': '4px',
			'1.5': '6px',
			'2': '8px',
			'2.5': '10px',
			'3': '12px',
			'3.5': '14px',
			'4': '16px',
			'5': '20px',
			'6': '24px',
			'7': '28px',
			'8': '32px',
			'9': '36px',
			'10': '40px',
			'11': '44px',
			'12': '48px',
			'14': '56px',
			'16': '64px',
			'20': '80px',
			'24': '96px',
			'28': '112px',
			'32': '128px',
			'36': '144px',
			'40': '160px',
			'44': '176px',
			'48': '192px',
			'52': '208px',
			'56': '224px',
			'60': '240px',
			'64': '256px',
			'72': '288px',
			'80': '320px',
			'96': '384px',
		},
		extend: {
			// Default palettes remapped onto the brand (see landing): blue/indigo/purple/violet
			// become the brand violet, grays become warm near-black neutrals, pink becomes brand pink.
			// Semantic green/red/amber/orange/yellow keep Tailwind defaults.
			colors: {
				blue: BRAND_VIOLET,
				indigo: BRAND_VIOLET,
				purple: BRAND_VIOLET,
				violet: BRAND_VIOLET,
				pink: BRAND_PINK,
				gray: WARM_NEUTRAL,
				zinc: WARM_NEUTRAL,
				slate: WARM_NEUTRAL,
				neutral: WARM_NEUTRAL,
				stone: WARM_NEUTRAL,
				lime: {
					DEFAULT: '#d7ff63',
					50: '#fbffec', 100: '#f4ffcf', 200: '#ebffa3', 300: '#e1ff80', 400: '#d7ff63',
					500: '#b8e63a', 600: '#8fb81f', 700: '#6b8b17', 800: '#566e18', 900: '#475b19', 950: '#253309',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// VJ Startups Innovation Colors
				'vj-primary': 'hsl(var(--vj-primary))',
				'vj-muted': 'hsl(var(--vj-muted))',
				'vj-accent': 'hsl(var(--vj-accent))',
				'vj-accent-foreground': 'hsl(var(--vj-accent-foreground))',
				'vj-accent-light': 'hsl(var(--vj-accent-light))',
				'vj-neutral': 'hsl(var(--vj-neutral))',
				'vj-border': 'hsl(var(--vj-border))',
				'vj-surface': 'hsl(var(--vj-surface))',
				'problem-primary': 'hsl(var(--problem-primary) / <alpha-value>)',
				'problem-light': 'hsl(var(--problem-light) / <alpha-value>)',
				'problem-muted': 'hsl(var(--problem-muted) / <alpha-value>)',
				'idea-primary': 'hsl(var(--idea-primary) / <alpha-value>)',
				'idea-light': 'hsl(var(--idea-light) / <alpha-value>)',
				'idea-muted': 'hsl(var(--idea-muted) / <alpha-value>)',
				'startup-primary': 'hsl(var(--startup-primary) / <alpha-value>)',
				'startup-light': 'hsl(var(--startup-light) / <alpha-value>)',
				'startup-muted': 'hsl(var(--startup-muted) / <alpha-value>)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'vj-base': 'var(--vj-radius-base)',
				'vj-button': 'var(--vj-radius-button)',
				'vj-large': 'var(--vj-radius-large)',
				'vj-xl': 'var(--vj-radius-xl)',
			},
			boxShadow: {
				'vj-subtle': 'var(--vj-shadow-subtle)',
				'vj-card': 'var(--vj-shadow-card)',
				'vj-innovation': 'var(--vj-shadow-innovation)',
				'vj-glow': 'var(--vj-shadow-glow)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'counter-up': {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'floating': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(20, 68, 185, 0.1)' },
					'50%': { boxShadow: '0 0 40px rgba(20, 68, 185, 0.2)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
				'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
				'counter-up': 'counter-up 1s cubic-bezier(0.16, 1, 0.3, 1)',
				'floating': 'floating 6s ease-in-out infinite',
				'glow': 'glow 4s ease-in-out infinite',
			}
		}
	},
	plugins: [animatePlugin],
} satisfies Config;
