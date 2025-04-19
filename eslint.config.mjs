import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            'react/prop-types': 'off',
            'prettier/prettier': 'error',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
