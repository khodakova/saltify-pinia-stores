import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin-js';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    files: ['**/*.ts'],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'indent':  ['error', 2],
      'linebreak-style': 'off',
      'no-console': 'off',
      'no-debugger': 'error',
      'no-unused-expressions': 'error',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-bitwise': ['error', { allow: ['~'] }],
      'no-unused-vars': 'warn',
      'object-curly-newline': 'off',
      'prefer-destructuring': ['error', { array: false, object: true, }, { enforceForRenamedProperties: false }],
      '@stylistic/comma-dangle': ['off', {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      }],
      '@stylistic/max-len': ['error', { code: 140, ignoreTemplateLiterals: true, ignoreStrings: true }],
      '@stylistic/linebreak-style': 'off',
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: { multiline: true, consistent: true },
        ObjectPattern: { multiline: true, consistent: true },
        ExportDeclaration: { multiline: true, minProperties: 3 },
      }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    }
  }
);
