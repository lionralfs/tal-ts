import { BaseClass } from './class';
import { Device, IDeviceConfig } from './devices/device';
import { Button } from './widgets/button';
export interface ILayout {
    classes: string[];
    css: IConfigCss[];
    width: number;
    height: number;
    module: string;
    preloadImages?: string[];
}
export interface IConfigCss {
    width: number;
    height: number;
    files: IConfigCss[];
}
export interface IApplication {
    run(): void;
    getBestFitLayout(): ILayout;
    addComponentContainer(id: any, module: any, args: any): any;
    showComponent(id: string, requireModule: string, args?: object): void;
    setLayout(layout: ILayout, styleBaseUrl: string, imageBaseUrl: string, additionalCSS: IConfigCss[], additionalClasses: string[], additionalPreloadImages: string[], callback: () => void): void;
    route(route: string[]): void;
    getDevice(): Device;
    getFocussedWidget(): Button;
}
export declare abstract class Application extends BaseClass implements IApplication {
    static getCurrentApplication(): object;
    private static runtimeContext;
    private rootElement;
    private rootWidget;
    private focussedWidget;
    private onReadyHandler;
    private device;
    private layout;
    constructor(rootElement: Element, styleBaseUrl: string, imageBaseUrl: string, onReadyHandler: () => void, configOverride?: IDeviceConfig);
    abstract run(): any;
    abstract route(route: string[]): any;
    addComponentContainer(id: any, requireModule: any, args: any): any;
    showComponent(id: string, requireModule: string, args?: object): void;
    getDevice(): Device;
    getBestFitLayout(): ILayout;
    setLayout(layout: ILayout, styleBaseUrl: string, imageBaseUrl: string, additionalCSS: IConfigCss[], additionalClasses: string[], additionalPreloadImages: string[], callback: () => void): void;
    getFocussedWidget(): Button;
}
