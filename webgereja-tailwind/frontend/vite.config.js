import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // listen ke semua interface
    port: 5173,
    strictPort: true,
    origin: 'http://crl.labjaringanukdw.my.id',
    hmr: {
      host: 'crl.labjaringanukdw.my.id',
      protocol: 'ws'
    }
  }
})
