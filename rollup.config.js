import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: !isProduction,
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: !isProduction,
        },
    ],
    plugins: [
        peerDepsExternal(),
        postcss({
            plugins: [postcssImport()],
            extensions: ['.css'],
            minimize: true,
            extract: 'index.css', // Extract CSS to a separate file
            modules: false, // Set to true if you're using CSS modules
        }),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            extensions: ['.ts', '.tsx'],
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        }),
        terser(),
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react-markdown'],
};
