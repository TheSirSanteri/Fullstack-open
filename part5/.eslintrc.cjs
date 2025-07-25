module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react'],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'react/react-in-jsx-scope': 'off' 
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
