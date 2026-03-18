import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: { index: path.resolve(import.meta.dirname, 'src/index.ts') },
      formats: ['es'],
    },
    cssCodeSplit: true,
    rolldownOptions: {
      external: ['vue'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
})
