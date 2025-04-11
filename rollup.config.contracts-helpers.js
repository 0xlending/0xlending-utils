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
    input: 'packages/contract-helpers/src/index.ts',
    output: [
        {
            dir: 'dist/contract-helpers',
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
            tsconfig: path.resolve(__dirname, 'tsconfig.json'),
            tsconfigDefaults: {
                compilerOptions: {
                    experimentalDecorators: true
                }
            }
        }),
        copy({
            targets: [
                {
                    src: 'packages/contract-helpers/src/README.md',
                    dest: 'dist/contract-helpers'
                }
            ]
        }),
        json(),
        commonjs(),
        babel({
            babelrc: false,
            babelHelpers: 'bundled' ,
            plugins: [
                // '@babel/transform-runtime'
            ],
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
        "bignumber.js",
        "ethers",
        "bn.js",
        "js-sha3",
        "hash.js",
        "isomorphic-unfetch",
        "ethers/lib/utils",
        "reflect-metadata"
    ],
        context: 'window', // 强制保留全局 this 指向
    },
    {
        input: 'packages/contract-helpers/src/index.ts',
        output: [{ file: "dist/contract-helpers/index.d.ts", format: "es" }],
        plugins: [dts()],
    },

];
