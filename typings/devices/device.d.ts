import { BaseClass } from '../class';
import { Application } from '../application';
export interface IDeviceCallbacks {
    onSuccess(deviceClass: Device): void;
    onError(ex: any): void;
}
export interface IDevice {
    setApplication(app: Application): void;
    addKeyEventListener(): void;
    getTopLevelElement(): Element;
    addClassToElement(el: Element, className: string): void;
    preloadImage(url: string): void;
    loadStyleSheet(url: string, callback: (res?: string) => void): void;
    getCurrentRoute(): string[];
}
export declare class Device extends BaseClass implements IDevice {
    private application;
    private config;
    private keyMap;
    constructor(config: object);
    static load(config: any, callbacks: IDeviceCallbacks): void;
    setApplication(app: Application): void;
    addKeyEventListener(): void;
    getTopLevelElement(): HTMLDivElement;
    addClassToElement(el: Element, className: string): void;
    preloadImage(url: string): void;
    loadStyleSheet(url: string, callback?: (res: string) => void): void;
    getCurrentRoute(): string[];
}
