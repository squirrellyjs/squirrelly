import { SqrlConfig } from './config';
export declare var promiseImpl: any;
declare var asyncFunc: FunctionConstructor | false;
export { asyncFunc };
export declare function hasOwnProp(obj: object, prop: string): boolean;
export declare function copyProps<T>(toObj: T, fromObj: T, notConfig?: boolean): T;
declare function trimWS(str: string, env: SqrlConfig, wsLeft: string | false, wsRight?: string | false): string;
export { trimWS };
