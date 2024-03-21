import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@': path.resolve(__dirname, 'src'),
      '@icons': path.resolve(__dirname, 'src/assets/material-icons'),
    }
  },
  server: {
    port: 3000,
    host: true,
  }
})
