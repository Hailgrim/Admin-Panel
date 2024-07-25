import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/valid-v-slot': 'warn',
    'vue/no-multiple-template-root': 'off',
    'vue/attributes-order': ['warn', { alphabetical: true }],
    semi: ['error', 'never'],
  },
})
