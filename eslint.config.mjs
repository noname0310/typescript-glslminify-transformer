 
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import { defineConfig } from "eslint/config";

const abbreviations = [
    "[XYZ][A-Z][a-z]",
    "HTML",
    "UI",
    "LOD",
    "XR",
    "PBR",
    "IBL",
    "HDR",
    "FFT",
    "CB",
    "RTW",
    "SSR",
    "RHS",
    "LHS",
    "LTC",
    "CDN",
    "ARIA",
    "IES",
    "RLE",
    "SSAO",
    "NME",
    "NGE",
    "SMAA",
    "RT",
    "TAA",
    "PT",
    "PP",
    "GI",
    "GBuffer",
    "[Bb]lur[XY]",
    "upsampling[XY]",
    "RSM",
    "DoF",
    "MSAA",
    "FXAA",
    "TBN",
    "GPU",
    "CPU",
    "FPS",
    "CSS",
    "MP3",
    "OGG",
    "HRTF",
    "JSON",
    "ZOffset",
    "IK",
    "UV",
    "[XYZ]Axis",
    "VR",
    "axis[XYZ]",
    "UBO",
    "URL",
    "RGB",
    "RGBD",
    "GL",
    "[23]D",
    "MRT",
    "RTT",
    "WGSL",
    "GLSL",
    "OS",
    "NDCH",
    "CSM",
    "POT",
    "DOM",
    "WASM",
    "BRDF",
    "wheel[XYZ]",
    "PLY",
    "STL",
    "[AB]Texture",
    "CSG",
    "DoN",
    "RAW",
    "ZIP",
    "PIZ",
    "VAO",
    "JS",
    "DB",
    "XHR",
    "POV",
    "BABYLON",
    "HSV",
    "[VUW](Offset|Rotation|Scale|Ang)",
    "DDS",
    "NaN",
    "SVG",
    "MRDL",
    "MTL",
    "OBJ",
    "SPLAT",
    "PLY",
    "glTF",
    "GLTF",
    "MSFT",
    "MSC",
    "QR",
    "BGR",
    "SFE",
    "BVH",

    "SDEF",
    "MD",
    "MR",
    "SD",
    "SR",
    "MPD",
    "MPR",
    "SPD",
    "SPR",
    "CKind",
    "RW[0-1]Kind",
    "VTable",
    "ERP",
    "CFM"
];
// Join them into a single regex string
const allowedNonStrictAbbreviations = abbreviations.join("|");

export default defineConfig({
    ignores: [
        "**/dist/*",
        "**/test_dist/*",
        "**/docs/*",
        "**/src/Runtime/Optimized/wasm/*",
        "**/src/Runtime/Optimized/wasm_src/*",
        "**/src/Runtime/Physics/External/*"
    ],
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
    ],
    files: [
        "**/*.ts",
        "**/*.tsx"
    ],
    plugins: {
        "@typescript-eslint": tseslint.plugin,
        "simple-import-sort": simpleImportSort,
        "@stylistic": stylistic,
    },

    languageOptions: {
        globals: {
            ...globals.browser
        },

        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json"
        }
    },

    rules: {
        "@typescript-eslint/consistent-type-imports": ["error", {
            prefer: "type-imports"
        }],

        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-namespace": "off",

        "@typescript-eslint/explicit-member-accessibility": ["error", {
            accessibility: "explicit",

            overrides: {
                accessors: "explicit",
                constructors: "explicit",
                methods: "explicit",
                properties: "explicit",
                parameterProperties: "explicit"
            }
        }],

        "@typescript-eslint/prefer-readonly": ["error"],
        "@typescript-eslint/explicit-function-return-type": ["error"],
        "@typescript-eslint/array-type": ["error"],
        "@typescript-eslint/prefer-includes": ["error"],
        "@stylistic/brace-style": ["error", "1tbs"],
        "@stylistic/space-before-blocks": ["error"],

        "@stylistic/type-annotation-spacing": ["error", {
            before: true,
            after: true,

            overrides: {
                colon: {
                    before: false,
                    after: true
                }
            }
        }],

         "@typescript-eslint/naming-convention": [
            "warn",
            {
                "selector": "default",
                "format": ["camelCase"]
            },
            {
                "selector": "variable",
                "format": ["camelCase", "UPPER_CASE", "snake_case"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "parameter",
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "enumMember",
                "format": ["camelCase", "UPPER_CASE"]
            },
            {
                "selector": "memberLike",
                "modifiers": ["public", "static"],
                "format": ["camelCase", "UPPER_CASE"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "memberLike",
                "modifiers": ["private", "static"],
                "format": ["camelCase", "UPPER_CASE"],
                "leadingUnderscore": "require"
            },
            {
                "selector": "memberLike",
                "modifiers": ["public"],
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "memberLike",
                "modifiers": ["private"],
                "format": ["camelCase"],
                "leadingUnderscore": "require"
            },
            {
                "selector": "memberLike",
                "modifiers": ["protected"],
                "format": ["camelCase"],
                "leadingUnderscore": "require"
            },
            {
                "selector": "typeLike",
                "format": ["PascalCase"]
            },
            {
                "selector": "variable",
                "format": ["camelCase", "UPPER_CASE"]
            },
            {
                "selector": "variable",
                "modifiers": ["const", "global"],
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "function",
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "function",
                "modifiers": ["exported", "global"],
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "interface",
                "format": ["PascalCase"]
            },
            {
                "selector": "class",
                "format": ["PascalCase"],
                "leadingUnderscore": "allow"
            }
        ],

        "comma-dangle": ["error", "never"],
        "comma-spacing": ["error"],
        "eol-last": ["error", "always"],
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "keyword-spacing": ["error"],
        "no-debugger": "warn",
        "no-inner-declarations": "off",

        "no-plusplus": ["error", {
            allowForLoopAfterthoughts: true
        }],

        "no-trailing-spaces": ["error"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "semi-spacing": ["error"],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "space-before-blocks": ["error"],
        "space-before-function-paren": ["error", "never"],
        "space-in-parens": ["error"],
        "space-infix-ops": ["error"],
        "space-unary-ops": ["error"]
    }
});
