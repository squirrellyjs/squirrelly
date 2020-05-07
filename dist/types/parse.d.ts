import { SqrlConfig } from './config';
export declare type TagType = 'h' | 'b' | 'i' | 'r' | 'c' | 'e' | 'q' | 's';
export declare type TemplateAttribute = 'c' | 'f' | 'fp' | 'p' | 'n' | 'res' | 'err';
export declare type TemplateObjectAttribute = 'c' | 'p' | 'n' | 'res';
export declare type AstObject = string | TemplateObject;
export declare type Filter = [string, string] | [string, string, true];
export interface TemplateObject {
    n?: string;
    t?: 'h' | 'b' | 'i' | 'c' | 'q' | 'e' | 's';
    f: Array<Filter>;
    c?: string;
    p?: string;
    res?: string;
    d?: Array<AstObject>;
    raw?: boolean;
    a?: boolean;
    b?: Array<ParentTemplateObject>;
}
export interface ParentTemplateObject extends TemplateObject {
    d: Array<AstObject>;
    b: Array<ParentTemplateObject>;
}
export default function parse(str: string, env: SqrlConfig): Array<AstObject>;
