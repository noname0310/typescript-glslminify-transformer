import ts, { factory } from "typescript";

// #region util

class TsUtils {
    public static chainBundle<T extends ts.SourceFile | ts.Bundle>(
        transformSourceFile: (x: ts.SourceFile) => ts.SourceFile | undefined
    ): (x: T) => T {
        function transformBundle(node: ts.Bundle): ts.Bundle {
            return factory.createBundle(
                node.sourceFiles.map(transformSourceFile).filter((x): x is ts.SourceFile => Boolean(x))
            );
        }

        return function transformSourceFileOrBundle(node: T): T {
            return ts.isSourceFile(node)
                ? (transformSourceFile(node) as T)
                : (transformBundle(node as ts.Bundle) as T);
        };
    }

    public static getNodeComment(node: ts.Node): string {
        return node.getSourceFile().getFullText().slice(node.getFullStart(), node.getStart());
    }
}

// #endregion

// #region transformer

class TransformerBuilder {
    private readonly _program: ts.Program;
    private readonly _prefixes: string[];

    public constructor(
        program: ts.Program,
        config?: TransformerConfig
    ) {
        this._program = program;

        const customPrefixes = config?.customPrefixes ?? [ "glsl" ];
        this._prefixes = customPrefixes.map(prefix => `/* ${prefix} */`);

        this._program; // for future use
    }

    public makeTransformer<T extends ts.Bundle | ts.SourceFile>(
        context: ts.TransformationContext
    ): ts.Transformer<T> {
        const visitor = (sourceFile: ts.SourceFile): ts.SourceFile => {
            return this._transformGlslMinify(sourceFile, context);
        };

        return TsUtils.chainBundle(visitor);
    }

    private _minifyGlslCode(code: string): string {
        return (code[0] === "\n" ? "\n" : "") + // preserve first newline
            code
                .replace(/^\uFEFF/, "")
                .replace(/\r\n/g, "\n")
                .replace(/(\/\/)+.*$/gm, "")
                .replace(/\t+/gm, " ")
                .replace(/^\s+/gm, "")
                // eslint-disable-next-line no-useless-escape
                .replace(/ ([\*\/\=\+\-\>\<]+) /g, "$1")
                .replace(/,[ ]/g, ",")
                .replace(/ {1,}/g, " ")
                // .replace(/;\s*/g, ";")
                .replace(/^#(.*)/gm, "#$1\n")
                .replace(/\{\n([^#])/g, "{$1")
                .replace(/\n\}/g, "}")
                .replace(/^(?:[\t ]*(?:\r?\n|\r))+/gm, "")
                .replace(/;\n([^#])/g, ";$1");
    }

    private _transformGlslMinify(
        sourceFile: ts.SourceFile,
        context: ts.TransformationContext
    ): ts.SourceFile {
        const visitor = (node: ts.Node): ts.Node => {
            if ((ts.isStringLiteral(node) || ts.isTemplateLiteral(node))) {
                const comment = TsUtils.getNodeComment(node);
                let isGlslLiteral = false;
                for (let i = 0; i < this._prefixes.length; i++) {
                    const prefix = this._prefixes[i];
                    if (comment.includes(prefix)) {
                        isGlslLiteral = true;
                        break;
                    }
                }
                if (isGlslLiteral) {
                    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
                        const minifiedCode = this._minifyGlslCode(node.getText().slice(1, -1));
                        return factory.createStringLiteral(minifiedCode);
                    } else {
                        const minifiedHeadText = this._minifyGlslCode(node.head.text);
                        const minifiedTemplateHead = factory.createTemplateHead(minifiedHeadText);

                        const minifiedTemplateSpans = node.templateSpans.slice(0, -1).map(templateSpan => {
                            const minifiedText = this._minifyGlslCode(templateSpan.literal.text);
                            return factory.createTemplateSpan(templateSpan.expression, factory.createTemplateMiddle(minifiedText));
                        });
                        {
                            const templateSpan = node.templateSpans[node.templateSpans.length - 1];
                            const minifiedText = this._minifyGlslCode(templateSpan.literal.text);
                            minifiedTemplateSpans.push(factory.createTemplateSpan(templateSpan.expression, factory.createTemplateTail(minifiedText)));
                        }

                        return factory.createTemplateExpression(minifiedTemplateHead, minifiedTemplateSpans);
                    }
                }
            }
            return ts.visitEachChild(node, visitor, context);
        };
        return ts.visitEachChild(sourceFile, visitor, context);
    }
}

export type TransformerConfig = {
    customPrefixes?: string[];
};

export default function transformer(program: ts.Program, config?: TransformerConfig): ts.TransformerFactory<ts.SourceFile> {
    const builder = new TransformerBuilder(program, config);
    return builder.makeTransformer.bind(builder);
}

// #endregion
