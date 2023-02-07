import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import resolver from '@rollup/plugin-node-resolve';
import { readFile } from 'fs/promises';

const pkg = JSON.parse(
    await readFile(
        new URL('./package.json', import.meta.url),
    ),
);

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default () => {
    const extensions = ['.js', '.ts'];
    const input = './src/index.js';

    const build = {
        input,
        external: [
            Object.keys(pkg.dependencies || {}),
            Object.keys(pkg.peerDependencies || {}),
        ].flat(),
        plugins: [
            json(),
            resolver({ extensions }),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                extensions,
                include: ['src/**/*'],
            }),
            isProd && terser(),
        ],
        output: [
            {
                file: pkg.module,
                format: 'esm',
            },
            {
                file: pkg.main,
                format: 'cjs',
            },
            {
                name: 'Request',
                file: pkg.browser,
                format: 'umd',
                sourcemap: true,
            },
        ],
    };
    const sandbox = {
        input: './sandbox/ts/test.js',
        external: [Object.keys(pkg.peerDependencies || {})].flat(),
        plugins: [
            json(),
            resolver({ extensions, browser: true, preferBuiltins: false }),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                extensions,
            }),
        ],
        output: [
            {
                file: './sandbox/js/test.js',
                format: 'esm',
            },
        ],
    };
    return [isProd && build, isDev && sandbox].filter(Boolean);
};

