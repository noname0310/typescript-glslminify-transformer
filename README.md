# typescript-glslminify-transformer

minify glsl code in typescript string literal

## Install

```sh
npm i -D typescript-glslminify-transformer ts-patch
```

## Usage

add following to `tsconfig.json`

```json
{
    "compilerOptions": {
        "plugins": [
            { "transform": "typescript-glslminify-transformer" }
        ]
    }
}
```

then use tspc to compile

```sh
tspc
```

## Example

```typescript
const glslString = /* glsl */ "gl_FragColor = vec4(vUv, 0.0, 1.0);";

const glslTemplateString = /* glsl */ `
    #define PI 3.141592653589793
    precision mediump float;
    varying vec2 vUv;
    void main () {
        #ifdef SOME_DEFINE
        someFunction();
        #endif
        gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
`;

const glslTemplateStringWithPlaceholders = /* glsl */`
    precision mediump float;
    varying vec2 vUv;
    void main () {
        #ifdef ${"SOME" + "_DEFINE"}
        someFunction();
        #endif
        gl_FragColor = vec4(vUv, ${1}, ${2});
    }
`;
```

will be transformed to

```typescript
const glslString = /* glsl */ "gl_FragColor=vec4(vUv,0.0,1.0);";
const glslTemplateString = /* glsl */ "#define PI 3.141592653589793\nprecision mediump float;varying vec2 vUv;void main () {\n#ifdef SOME_DEFINE\nsomeFunction();\n#endif\ngl_FragColor=vec4(vUv,0.0,1.0);}\n";
const glslTemplateStringWithPlaceholders = /* glsl */ `precision mediump float;varying vec2 vUv;void main () {\n#ifdef \n${"SOME" + "_DEFINE"}someFunction();\n#endif\ngl_FragColor=vec4(vUv,${1},${2});}\n`;
```
