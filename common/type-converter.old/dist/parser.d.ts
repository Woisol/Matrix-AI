import ts from 'typescript';
export interface TypeInfo {
    name: string;
    kind: 'interface' | 'type' | 'enum';
    properties?: PropertyInfo[];
    value?: string;
    enumValues?: string[];
    comments?: string[];
    extends?: string[];
}
export interface PropertyInfo {
    name: string;
    type: string;
    optional: boolean;
    comments?: string[];
    isArray: boolean;
    isUnion: boolean;
    unionTypes?: string[];
}
export declare class TypeScriptParser {
    private program;
    private checker;
    constructor(fileNames: string[], options?: ts.CompilerOptions);
    parseFiles(): TypeInfo[];
    private parseInterface;
    private parseTypeAlias;
    private parseEnum;
    private parseProperty;
    private getTypeString;
    private isArrayType;
    private getComments;
}
//# sourceMappingURL=parser.d.ts.map