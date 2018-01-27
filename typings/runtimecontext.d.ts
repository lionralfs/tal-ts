import { Application } from './application';
import { BaseClass } from './class';
import { Device } from './devices/device';
export interface IRuntimeContext extends BaseClass {
    clearCurrentApplication(): void;
    setCurrentApplication(app: Application): void;
    getCurrentApplication(): object;
    getDevice(): object;
}
export declare class RuntimeContextClass extends BaseClass implements IRuntimeContext {
    private static applicationObject;
    constructor();
    clearCurrentApplication(): void;
    setCurrentApplication(app: Application): void;
    getCurrentApplication(): Application;
    getDevice(): Device;
}
export declare const RuntimeContext: RuntimeContextClass;
