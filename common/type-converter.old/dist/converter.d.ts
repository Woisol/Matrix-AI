#!/usr/bin/env node
declare class TypeConverter {
    private config;
    private projectRoot;
    constructor(configPath?: string);
    convert(): Promise<void>;
    private getTypeFiles;
    private getOutputPath;
    private ensureOutputDir;
    private addFileHeader;
    static run(): Promise<void>;
}
export { TypeConverter };
//# sourceMappingURL=converter.d.ts.map