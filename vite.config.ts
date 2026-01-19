import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/task-manager_react-vite/',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 500
    },
  },
})
