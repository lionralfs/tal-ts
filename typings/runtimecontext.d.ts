import { BaseClass } from './class';
import { Application } from './application';
export interface IRuntimeContext extends BaseClass {
    clearCurrentApplication(): void;
    setCurrentApplication(app: Application): void;
    getCurrentApplication(): object;
    getDevice(): object;
}
export declare class RuntimeContextClass extends BaseClass implements IRuntimeContext {
    private applicationObject;
    constructor();
    clearCurrentApplication(): void;
    setCurrentApplication(app: Application): void;
    getCurrentApplication(): Application;
    getDevice(): any;
}
export declare const RuntimeContext: RuntimeContextClass;
