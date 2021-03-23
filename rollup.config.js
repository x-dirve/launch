const typescript = require("rollup-plugin-typescript2");
const resolve = require("rollup-plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const cjs = require("rollup-plugin-commonjs");
const alias = require("rollup-plugin-alias");
const buble = require("rollup-plugin-buble");
const babel = require("rollup-plugin-babel");
const { join } = require("path");

const isProduction = process.env.NODE_ENV === "production";
const cwd = __dirname;

// 入口文件
const input = join(cwd, "src/index.ts");

const baseConfig = {
    input
    ,"output": [
        {
            "file": join(cwd, "dist/index.js")
            , "format": "cjs"
            , "sourcemap": true
            , "exports": "named"
        }
    ]
    ,"plugins": [
        resolve({
            "preferBuiltins": false
        })
        , cjs()
        , babel({
            "babelrc": false
            , "presets": [
                ["@babel/preset-env", {
                    "modules": false
                }]
            ]
            , "plugins": [
                [
                    "import"
                    , {
                        "libraryName": "@x-drive/utils"
                        , "libraryDirectory": "dist/libs"
                        , "camel2DashComponentName": false
                    }
                    , "@x-drive/utils"
                ]
            ]
            , "include": "node_modules/@x-drive"
        })
        , typescript({
            "tsconfigOverride": {
                "compilerOptions": {
                    "preserveConstEnums": true
                }
            }
        })
        , buble({
            "transforms": {
                "dangerousTaggedTemplateString": true
            }
        })
    ]
}

const umdConfig = {
    input
    , "output": [
        {
            "file": join(cwd, "dist/index.umd.js")
            , "format": "umd"
            , "sourcemap": false
            , "exports": "named"
            , "name": "xLaunch"
        }
    ]
    , "plugins": [
        ...baseConfig.plugins
        , isProduction && terser()
    ]
}

const esmConfig = {
    input
    , "output": {
        "sourcemap": true
        , "format": "es"
        , "file": join(cwd, "dist/index.esm.js")
    }
    , "plugins": [
        babel({
            "babelrc": false,
            "presets": [
                ['@babel/preset-env', {
                    "modules": false
                }]
            ],
            "plugins": [
                [
                    "import"
                    , {
                        "libraryName": "@x-drive/utils"
                        , "libraryDirectory": "dist/libs"
                        , "camel2DashComponentName": false
                    }
                    , "@x-drive/utils"
                ]
            ]
            , "include": "node_modules/@x-drive"

        })
        , alias({
            "entries": [
                {
                    "find": "@x-drive/utils"
                    , "replacement": join(cwd, "node_modules/@x-drive/utils/dist/index.esm")
                }
            ]
        })
        , typescript()
    ]
}

module.exports = [baseConfig, umdConfig, esmConfig];
