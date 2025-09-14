import { TypeInfo } from './parser.js';
export interface GeneratorConfig {
    typeMapping: Record<string, string>;
    customTypes: Record<string, {
        pythonType: string;
        field: string;
    }>;
    enumTypes: Record<string, {
        values: string[];
        baseType: string;
    }>;
    imports: string[];
}
export declare class PydanticGenerator {
    private config;
    private processedTypes;
    constructor(config: GeneratorConfig);
    generateModels(types: TypeInfo[]): string;
    private generateEnum;
    private generateModel;
    private generateProperty;
    private generateFieldDescription;
    private generateTypeAlias;
    private mapTypeToPython;
}
//# sourceMappingURL=generator.d.ts.map