module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/vue',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-console': process.env.ENV === 'pro' ? 'error' : 'off',
    'no-debugger': process.env.ENV === 'pro' ? 'error' : 'off',
    curly: 'error',
    'default-case': 2,
    'prettier/prettier': 'error',
    'no-trailing-spaces': 'error',
    'vue/require-default-prop': 'off',
    'vue/attributes-order': 'error',
    'vue/no-confusing-v-for-v-if': 'error',
    'vue/no-v-html': 'off',
    'vue/order-in-components': 'error',
    'vue/this-in-template': 'error',
    'nuxt/no-cjs-in-config': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
        },
      },
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: [
          '/ui-(.*)/',
          'component',
          'keep-alive',
          'transition',
          'transition-group',
        ],
      },
    ],
  },
}
