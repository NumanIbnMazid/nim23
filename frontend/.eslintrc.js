module.exports = {
  root: true,
  "env": {
    "browser": true,
    "amd": true,
    "node": true
  },
  parserOptions: {
    sourceType: 'module',
    parser: 'esprima',
  },
  // standard eslint
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:vue/recommended"
  ],
  // required to lint *.vue files
  plugins: [
    "prettier",
    "vue"
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      },
      node: {
        extensions: ['.js', '.jsx', '.vue']
      }
    }
  },
  // custom rules here
  'rules': {
    "prettier/prettier": "off",
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": ["error"],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  }
}
