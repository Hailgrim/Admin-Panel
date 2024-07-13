import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
  // options here
})
  .override('nuxt/vue/rules', {
    rules: {
      'vue/valid-v-slot': ['warn'],
    },
  })
  .override('nuxt/vue/single-root', {
    rules: {
      'vue/no-multiple-template-root': 'off',
    },
  });
