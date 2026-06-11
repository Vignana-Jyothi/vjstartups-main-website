import type { Config } from "tailwindcss";

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
			'inter': ['Inter', 'sans-serif'],
			'playfair': ['Playfair Display', 'serif'],
			'sans': ['Inter', 'sans-serif'],
			'serif': ['Playfair Display', 'serif'],
		},
		spacing: {
			'0': '0',
			'1': '4px',
			'2': '8px',
			'3': '12px',
			'4': '16px',
			'5': '20px',
			'6': '24px',
			'8': '32px',
			'10': '40px',
			'12': '48px',
			'16': '64px',
			'20': '80px',
			'24': '96px',
			'32': '128px',
			'40': '160px',
			'48': '192px',
			'56': '224px',
			'64': '256px',
		},
		extend: {
			colors: {
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
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
