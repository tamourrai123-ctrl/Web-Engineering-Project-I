import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Web-Engineering-Project-I/',
  plugins: [react()],
})