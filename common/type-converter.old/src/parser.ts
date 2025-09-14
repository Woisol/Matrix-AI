import ts from 'typescript';
import fs from 'fs';
import path from 'path';

export interface TypeInfo {
  name: string;
  kind: 'interface' | 'type' | 'enum';
  properties?: PropertyInfo[];
  value?: string; // for type aliases
  enumValues?: string[]; // for enums
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

export class TypeScriptParser {
  private program: ts.Program;
  private checker: ts.TypeChecker;

  constructor(fileNames: string[], options: ts.CompilerOptions = {}) {
    this.program = ts.createProgram(fileNames, {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      ...options
    });
    this.checker = this.program.getTypeChecker();
  }

  public parseFiles(): TypeInfo[] {
    const results: TypeInfo[] = [];
    
    for (const sourceFile of this.program.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile) continue;
      
      ts.forEachChild(sourceFile, (node) => {
        if (ts.isInterfaceDeclaration(node)) {
          results.push(this.parseInterface(node));
        } else if (ts.isTypeAliasDeclaration(node)) {
          results.push(this.parseTypeAlias(node));
        } else if (ts.isEnumDeclaration(node)) {
          results.push(this.parseEnum(node));
        }
      });
    }
    
    return results;
  }

  private parseInterface(node: ts.InterfaceDeclaration): TypeInfo {
    const name = node.name.text;
    const properties: PropertyInfo[] = [];
    const comments = this.getComments(node);
    
    // 处理继承
    const extends_: string[] = [];
    if (node.heritageClauses) {
      for (const clause of node.heritageClauses) {
        if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
          extends_.push(...clause.types.map(t => t.expression.getText()));
        }
      }
    }

    for (const member of node.members) {
      if (ts.isPropertySignature(member) && member.name) {
        properties.push(this.parseProperty(member));
      }
    }

    return {
      name,
      kind: 'interface',
      properties,
      comments,
      extends: extends_.length > 0 ? extends_ : undefined
    };
  }

  private parseTypeAlias(node: ts.TypeAliasDeclaration): TypeInfo {
    const name = node.name.text;
    const comments = this.getComments(node);
    
    // 处理联合类型
    if (ts.isUnionTypeNode(node.type)) {
      const unionTypes = node.type.types.map(t => this.getTypeString(t));
      return {
        name,
        kind: 'type',
        value: unionTypes.join(' | '),
        comments
      };
    }
    
    // 处理对象类型
    if (ts.isTypeLiteralNode(node.type)) {
      const properties: PropertyInfo[] = [];
      for (const member of node.type.members) {
        if (ts.isPropertySignature(member) && member.name) {
          properties.push(this.parseProperty(member));
        }
      }
      return {
        name,
        kind: 'interface', // 将对象类型视为接口
        properties,
        comments
      };
    }
    
    return {
      name,
      kind: 'type',
      value: this.getTypeString(node.type),
      comments
    };
  }

  private parseEnum(node: ts.EnumDeclaration): TypeInfo {
    const name = node.name.text;
    const enumValues: string[] = [];
    const comments = this.getComments(node);

    for (const member of node.members) {
      if (member.initializer && ts.isStringLiteral(member.initializer)) {
        enumValues.push(member.initializer.text);
      } else if (member.name) {
        enumValues.push(member.name.getText().replace(/['"]/g, ''));
      }
    }

    return {
      name,
      kind: 'enum',
      enumValues,
      comments
    };
  }

  private parseProperty(member: ts.PropertySignature): PropertyInfo {
    const name = member.name!.getText().replace(/['"]/g, '');
    const optional = !!member.questionToken;
    const comments = this.getComments(member);
    
    let type = 'any';
    let isArray = false;
    let isUnion = false;
    let unionTypes: string[] = [];

    if (member.type) {
      type = this.getTypeString(member.type);
      isArray = this.isArrayType(member.type);
      
      if (ts.isUnionTypeNode(member.type)) {
        isUnion = true;
        unionTypes = member.type.types.map(t => this.getTypeString(t));
      }
    }

    return {
      name,
      type,
      optional,
      comments,
      isArray,
      isUnion,
      unionTypes: unionTypes.length > 0 ? unionTypes : undefined
    };
  }

  private getTypeString(typeNode: ts.TypeNode): string {
    return typeNode.getText();
  }

  private isArrayType(typeNode: ts.TypeNode): boolean {
    return ts.isArrayTypeNode(typeNode) || 
           (ts.isTypeReferenceNode(typeNode) && 
            typeNode.typeName.getText() === 'Array');
  }

  private getComments(node: ts.Node): string[] {
    const comments: string[] = [];
    const sourceFile = node.getSourceFile();
    
    // 获取前置注释
    const fullText = sourceFile.getFullText();
    const commentRanges = ts.getLeadingCommentRanges(fullText, node.getFullStart());
    
    if (commentRanges) {
      for (const range of commentRanges) {
        const comment = fullText.substring(range.pos, range.end);
        const cleanComment = comment
          .replace(/^\/\*\*?/, '')
          .replace(/\*\/$/, '')
          .replace(/^\s*\*\s?/gm, '')
          .replace(/^\/\/\s?/, '')
          .trim();
        
        if (cleanComment) {
          comments.push(cleanComment);
        }
      }
    }
    
    return comments;
  }
}