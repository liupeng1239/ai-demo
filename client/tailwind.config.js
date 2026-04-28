export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#f7f9fb',
        'surface-dim': '#d8dadc',
        'surface-bright': '#f7f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        'on-surface': '#191c1e',
        'on-surface-variant': '#3d4947',
        'inverse-surface': '#2d3133',
        outline: '#6d7a77',
        'outline-variant': '#bcc9c6',
        'surface-tint': '#006a61',
        primary: '#00685f',
        'on-primary': '#ffffff',
        'primary-container': '#008378',
        'on-primary-container': '#f4fffc',
        'inverse-primary': '#6bd8cb',
        secondary: '#505f76',
        'secondary-container': '#d0e1fb',
      },
      fontFamily: {
        sans: ['Inter', 'Microsoft YaHei', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
