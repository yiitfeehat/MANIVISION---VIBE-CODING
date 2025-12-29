import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        watch: {
            usePolling: true,
        },
        proxy: {
            // Proxy API requests to the server container
            '/api': {
                target: 'http://server:3000',
                changeOrigin: true,
                secure: false,
            }
        },
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        }
    }
})
