import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: '#00ffcc',
        space: '#000008',
        bg2: '#05080f',
        bg3: '#0a0f1e',
        purple: '#7c3aed',
        amber: '#f59e0b',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        noto: ['Noto Sans KR', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
