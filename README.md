# rolldown: `sanitizeFileName` ignored with `preserveModules` + object-form `entry`

Minimal reproduction for a rolldown bug where `sanitizeFileName` is not applied to JS chunk filenames when using `preserveModules: true` with object-form `entry` in Vite 8 lib mode.

## Bug

When a Vue SFC has `<script setup lang="ts">`, Vue internally generates a module with an ID like:

```
TestComp.vue?vue&type=script&setup=true&lang.ts
```

With `preserveModules: true`, this module is emitted as its own chunk. The `?` and `&` characters in the filename should be sanitized (replaced with `_`), but they are not:

```
dist/components/TestComp.vue?vue&type=script&setup=true&lang.js   # actual (bug)
dist/components/TestComp.vue_vue_type_script_setup_true_lang.js   # expected
```

Note: CSS filenames (`<style scoped>`) **are** correctly sanitized:

```
dist/components/TestComp.vue_vue_type_style_index_0_scoped_e5f89d78_lang.css  # correct
```

## Reproduce

```bash
pnpm install
pnpm build
```

Observe that `dist/components/TestComp.vue?vue&type=script&setup=true&lang.js` is output with unsanitized `?` and `&` in the filename.

## Environment

- vite 8.0.0 (rolldown 1.0.0-rc.9)
- @vitejs/plugin-vue 6.0.5
- vue 3.5.30

## Key config (`vite.config.ts`)

```ts
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
```

## Additional findings

| Condition | Result |
|---|---|
| Object-form entry + `preserveModules` + `<script setup lang="ts">` | **Bug**: JS filename contains `?` and `&` |
| Object-form entry + `preserveModules` + `<style scoped>` only | OK: CSS filename is sanitized |
| Custom `sanitizeFileName` function in output options | **Ignored** for the affected JS chunks |
| `entryFileNames` function as workaround | **Works**: can manually sanitize chunk names |

## Workaround

Use `entryFileNames` as a function to manually sanitize:

```ts
output: {
  preserveModules: true,
  preserveModulesRoot: 'src',
  entryFileNames: (chunk) => {
    const name = chunk.name.replace(/[\x00-\x1f?#&*+:;<=>{|}[\]^`"$%,\\]/g, '_')
    return `${name}.js`
  },
},
```

## Related

- [rolldown#7554](https://github.com/nicolo-ribaudo/rolldown/issues/7554) — fixed `sanitizeFileName` for string-form entry in `preserveModules` mode
