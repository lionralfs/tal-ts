import { Application, IConfigCss } from '../application';
import { BaseClass } from '../class';
import { IShowOptions } from '../widgets/widget';
export interface IDeviceConfig {
    css?: IConfigCss[];
    modules: {
        base: string;
        modifiers: string[];
    };
    mediasets?: {
        tv: string;
        radio: string;
    };
    logging?: {
        level: string;
        strategy?: string;
    };
    input: {
        map: {
            [key: string]: any;
        };
    };
}
export interface ILoggingMethods {
    log: (message?: any, ...optionalParams: any[]) => void;
    debug: (message?: any, ...optionalParams: any[]) => void;
    info: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
}
export interface IDeviceCallbacks {
    onSuccess(deviceClass: Device): void;
    onError(ex: any): void;
}
export interface IShowElementOptions extends IShowOptions {
    el: Node;
}
export interface IDevice {
    setApplication(app: Application): void;
    addKeyEventListener(): void;
    getTopLevelElement(): Node;
    addClassToElement(el: Element, className: string): void;
    preloadImage(url: string): void;
    loadStyleSheet(url: string, callback: (res?: string) => void): void;
    getCurrentRoute(): string[];
    setElementClasses(el: Element, classNames: string[]): void;
    showElement(options: IShowElementOptions): object;
    getConfig(): object;
}
export declare abstract class Device extends BaseClass implements IDevice {
    static load(config: IDeviceConfig, callbacks: IDeviceCallbacks): void;
    static addLoggingMethod(moduleId: string, loggingMethods: object): void;
    private static loggingStrategies;
    private static filteredLoggingMethods;
    private application;
    private config;
    private keyMap;
    constructor(config: IDeviceConfig);
    setApplication(app: Application): void;
    getConfig(): object;
    abstract addKeyEventListener(): any;
    abstract getTopLevelElement(): any;
    abstract addClassToElement(el: Element, className: string): any;
    abstract preloadImage(url: string): any;
    abstract loadStyleSheet(url: string, callback?: (res: string) => void): any;
    abstract getCurrentRoute(): any;
    abstract setElementClasses(el: Node, classNames: string[]): any;
    abstract showElement(options: IShowElementOptions): any;
}
