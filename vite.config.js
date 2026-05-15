import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite config — tells Vite which plugins to use
export default defineConfig({
  plugins: [
    react(),          // enables React (JSX support)
    tailwindcss(),    // enables Tailwind CSS
  ],
})