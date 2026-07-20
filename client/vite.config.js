import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Custom Vite plugin: strips the `crossorigin` attribute from all <script> and <link>
 * tags in the final built HTML. This is CRITICAL for Electron compatibility:
 * Electron loads the built app from disk via file:// protocol (where origin = null).
 * The CORS policy then blocks any resource tagged crossorigin="anonymous" from loading,
 * causing a completely blank white window — exactly the bug we're fixing here.
 */
function electronCompatibilityPlugin() {
  return {
    name: 'electron-remove-crossorigin',
    transformIndexHtml(html) {
      return html
        .replace(/\s*crossorigin="anonymous"/g, '')
        .replace(/\s*crossorigin\b/g, '');
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), electronCompatibilityPlugin()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    chunkSizeWarningLimit: 1500,
  }
})
