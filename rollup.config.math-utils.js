import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import babel from '@rollup/plugin-babel'
import ts from 'rollup-plugin-typescript2'
import dts from "rollup-plugin-dts";
import path from 'path';
import json from "@rollup/plugin-json";
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


export default [
    {
    input: 'packages/math-utils/src/index.ts',
    output: [
        {
            dir: 'dist/math-utils',
            format: 'es',
            sourcemap:false,
        },

    ],
    plugins: [
        resolve({
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
            modulesOnly: true,
            preferBuiltins: false
        }),
        ts({
            tsconfig: path.resolve(__dirname, 'tsconfig.json')
        }),
        copy({
            targets: [
                {
                    src: 'packages/math-utils/src/README.md',
                    dest: 'dist/math-utils'
                }
            ]
        }),
        json(),
        commonjs(),
        babel({
            babelrc: false,
            babelHelpers: 'bundled' ,
            // plugins: [
            //     '@babel/transform-runtime'
            // ],
            exclude: 'node_modules/**',
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
            presets: ['@babel/preset-env', '@babel/preset-react']
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify( 'production' ),
            preventAssignment: true
        })
    ],
    external: [
        "bignumber.js"
    ],
    },
    {
        input: 'packages/math-utils/src/index.ts',
        output: [{ file: "dist/math-utils/index.d.ts", format: "es" }],
        plugins: [dts()],
    },

];
