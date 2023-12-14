import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'vue/valid-v-slot': ['warn'],
    'node/prefer-global/process': ['warn', 'always'],
  },
})
