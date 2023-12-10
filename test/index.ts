const glslString = /* glsl */ `
    precision mediump float;
    varying vec2 vUv;
    void main () {
        gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
`;
glslString;

const glslWithMultiplePlaceholders = /* glsl */`
    precision mediump float;
    varying vec2 vUv;
    void main () {
        gl_FragColor = vec4(vUv, ${1}, ${2});
    }
`;
glslWithMultiplePlaceholders;

function foo(str: string): string {
    return str;
}

class SomeClass {
    public constructor() {
        const glslString = /* glsl */ `
            #define SOME_DEFINE
            precision mediump float;
            varying vec2 vUv;
            #ifdef SOME_DEFINE
            void main () {
                gl_FragColor = vec4(vUv, 0.0, 1.0);
            }
            #endif
        `;
        glslString;


        const variable = 1;

        const glslStringWithPlaceholder = /* glsl */`
        #define SOME_DEFINE
            precision mediump float;
            varying vec2 vUv;
            #ifdef SOME_DEFINE
            void main () {
                gl_FragColor = vec4(vUv, ${variable}, 1.0);
            }
            #endif
        `;
        glslStringWithPlaceholder;

        const injectStatement = /* glsl */ "gl_FragColor = vec4(vUv, 0.0, 1.0);";

        const glslStringWithInject = /* glsl */`
            precision mediump float;
            varying vec2 vUv;
            void main () {
                ${injectStatement}
            }
        `;
        glslStringWithInject;

        foo(/* glsl */`
            precision mediump float;
            varying vec2 vUv;
            void main () {
                gl_FragColor = vec4(vUv, 0.0, 1.0);
            }
        `);

        foo(/* glsl */`
            precision mediump float;
            varying vec2 vUv;
            void main () {
                gl_FragColor = vec4(vUv, ${variable}, 1.0);
            }
        `);
    }
}
