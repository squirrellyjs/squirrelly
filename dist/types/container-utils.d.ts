export declare function errWithBlocksOrFilters(name: string, blocks: Array<any> | false, // false means don't check
filters: Array<any> | false, native?: boolean): void;
export declare function asyncArrLoop(arr: Array<any>, index: number, fn: Function, res: string, cb: Function): void;
export declare function asyncObjLoop(obj: {
    [index: string]: any;
}, keys: Array<string>, index: number, fn: Function, res: string, cb: Function): void;
export declare function replaceChar(s: string): string;
export declare function XMLEscape(str: unknown): string;
