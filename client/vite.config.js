import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: [
        // Add the directory where the reports are located
        'D:/My Projects/Mobile App(android)/SoulScroll(Git)/Hospital_Management_System/api/reports',
        // Add your client root directory if not already included
        'D:/My Projects/Mobile App(android)/SoulScroll(Git)/Hospital_Management_System/client'
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
});