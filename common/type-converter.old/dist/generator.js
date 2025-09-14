export class PydanticGenerator {
    constructor(config) {
        this.processedTypes = new Set();
        this.config = config;
    }
    generateModels(types) {
        const lines = [];
        // 添加导入
        lines.push(...this.config.imports);
        lines.push('');
        // 生成自定义类型别名
        lines.push('# 自定义类型别名');
        for (const [typeName, typeConfig] of Object.entries(this.config.customTypes)) {
            lines.push(`${typeName} = Annotated[${typeConfig.pythonType}, ${typeConfig.field}]`);
        }
        lines.push('');
        // 生成枚举
        const enums = types.filter(t => t.kind === 'enum');
        if (enums.length > 0) {
            lines.push('# 枚举类型');
            for (const enumType of enums) {
                lines.push(...this.generateEnum(enumType));
                lines.push('');
            }
        }
        // 生成模型
        const models = types.filter(t => t.kind === 'interface' || (t.kind === 'type' && t.properties));
        if (models.length > 0) {
            lines.push('# 数据模型');
            for (const model of models) {
                lines.push(...this.generateModel(model));
                lines.push('');
            }
        }
        // 生成类型别名
        const aliases = types.filter(t => t.kind === 'type' && !t.properties && !t.enumValues);
        if (aliases.length > 0) {
            lines.push('# 类型别名');
            for (const alias of aliases) {
                lines.push(...this.generateTypeAlias(alias));
            }
        }
        return lines.join('\\n').trim();
    }
    generateEnum(enumType) {
        const lines = [];
        const enumConfig = this.config.enumTypes[enumType.name];
        if (enumType.comments && enumType.comments.length > 0) {
            lines.push(`# ${enumType.comments.join(' ')}`);
        }
        const baseType = enumConfig?.baseType || 'str';
        lines.push(`class ${enumType.name}(${baseType}, Enum):`);
        if (enumType.enumValues && enumType.enumValues.length > 0) {
            for (const value of enumType.enumValues) {
                const pythonValue = value.replace(/-/g, '_').toUpperCase();
                lines.push(`    ${pythonValue} = "${value}"`);
            }
        }
        else {
            lines.push('    pass');
        }
        return lines;
    }
    generateModel(model) {
        const lines = [];
        if (model.comments && model.comments.length > 0) {
            lines.push(`# ${model.comments.join(' ')}`);
        }
        // 处理继承
        let baseClass = 'BaseModel';
        if (model.extends && model.extends.length > 0) {
            // 简单处理，假设只继承一个类
            baseClass = model.extends[0] || 'BaseModel';
        }
        lines.push(`class ${model.name}(${baseClass}):`);
        if (!model.properties || model.properties.length === 0) {
            lines.push('    pass');
            return lines;
        }
        // 生成属性
        for (const prop of model.properties) {
            lines.push(...this.generateProperty(prop));
        }
        return lines;
    }
    generateProperty(prop) {
        const lines = [];
        // 添加注释
        if (prop.comments && prop.comments.length > 0) {
            lines.push(`    # ${prop.comments.join(' ')}`);
        }
        // 处理类型
        let pythonType = this.mapTypeToPython(prop.type);
        // 处理数组类型
        if (prop.isArray) {
            pythonType = `List[${pythonType}]`;
        }
        // 处理联合类型
        if (prop.isUnion && prop.unionTypes) {
            const unionTypes = prop.unionTypes.map(t => this.mapTypeToPython(t));
            pythonType = `Union[${unionTypes.join(', ')}]`;
        }
        // 处理可选类型
        if (prop.optional) {
            pythonType = `Optional[${pythonType}]`;
        }
        // 生成字段定义
        const defaultValue = prop.optional ? ' = None' : '';
        const fieldDesc = this.generateFieldDescription(prop);
        lines.push(`    ${prop.name}: ${pythonType}${defaultValue}${fieldDesc}`);
        return lines;
    }
    generateFieldDescription(prop) {
        // 检查是否是自定义类型
        if (this.config.customTypes[prop.type]) {
            return ''; // 自定义类型已经包含了Field定义
        }
        const descriptions = [];
        if (prop.comments && prop.comments.length > 0) {
            descriptions.push(prop.comments.join(' '));
        }
        if (descriptions.length > 0) {
            const desc = descriptions.join('; ').replace(/'/g, "\\'");
            return ` = Field(..., description='${desc}')`;
        }
        return prop.optional ? '' : ' = Field(...)';
    }
    generateTypeAlias(alias) {
        const lines = [];
        if (alias.comments && alias.comments.length > 0) {
            lines.push(`# ${alias.comments.join(' ')}`);
        }
        let pythonType = 'Any';
        if (alias.value) {
            pythonType = this.mapTypeToPython(alias.value);
        }
        lines.push(`${alias.name} = ${pythonType}`);
        return lines;
    }
    mapTypeToPython(tsType) {
        // 移除空格并规范化
        tsType = tsType.trim();
        // 处理自定义类型
        if (this.config.customTypes[tsType]) {
            return tsType; // 使用自定义类型别名
        }
        // 处理基础类型映射
        if (this.config.typeMapping[tsType]) {
            return this.config.typeMapping[tsType] || 'Any';
        }
        // 处理数组类型
        if (tsType.endsWith('[]')) {
            const itemType = tsType.slice(0, -2);
            return `List[${this.mapTypeToPython(itemType)}]`;
        }
        // 处理泛型类型
        const genericMatch = tsType.match(/^Array<(.+)>$/);
        if (genericMatch && genericMatch[1]) {
            return `List[${this.mapTypeToPython(genericMatch[1])}]`;
        }
        // 处理联合类型
        if (tsType.includes(' | ')) {
            const unionTypes = tsType.split(' | ').map(t => this.mapTypeToPython(t.trim()));
            return `Union[${unionTypes.join(', ')}]`;
        }
        // 处理对象类型
        if (tsType.startsWith('{') && tsType.endsWith('}')) {
            return 'Dict[str, Any]';
        }
        // 默认返回原类型名（假设是已定义的模型）
        return tsType;
    }
}
//# sourceMappingURL=generator.js.map