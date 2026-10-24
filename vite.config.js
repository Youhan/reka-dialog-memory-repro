import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue(), {
    name: 'reproduction-clear-completed-cleanup',
    enforce: 'pre',
    transform(code, id) {
      if (mode !== 'patched' || !id.replaceAll('\\', '/').endsWith('/dist/shared/useHideOthers.js')) return
      const before = 'if (undo) undo();'
      if (code.split(before).length !== 3) throw new Error('Unexpected useHideOthers source; review patch before running')
      return code.replaceAll(before, 'if (undo) { undo(); undo = undefined; }')
    },
  }],
  define: { __PATCHED__: JSON.stringify(mode === 'patched') },
  build: { outDir: mode === 'patched' ? 'dist/patched' : 'dist/original' },
}))
