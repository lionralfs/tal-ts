import { BaseClass } from './class';
import { IRuntimeContext } from './runtimecontext';
export interface ILayout {
    classes: string[];
    css: IConfigCss[];
    width: number;
    height: number;
    module: string;
    preloadImages?: string[];
}
export interface IConfiguration {
    css?: IConfigCss[];
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
    setLayout(layout: ILayout, styleBaseUrl: string, imageBaseUrl: string, additionalCSS: IConfigCss[], additionalClasses: string[], additionalPreloadImages: string[], callback: () => void): void;
    route(route: string[]): void;
}
export declare class Application extends BaseClass implements IApplication {
    static runtimeContext: IRuntimeContext;
    static getCurrentApplication(): object;
    private rootElement;
    private rootWidget;
    private focussedWidget;
    private onReadyHandler;
    private device;
    private layout;
    constructor(rootElement: Element, styleBaseUrl: string, imageBaseUrl: string, onReadyHandler: Function, configOverride: IConfiguration);
    run(): void;
    route(route: string[]): void;
    addComponentContainer(id: any, module: any, args: any): any;
    getDevice(): any;
    getBestFitLayout(): ILayout;
    setLayout(layout: ILayout, styleBaseUrl: string, imageBaseUrl: string, additionalCSS: IConfigCss[], additionalClasses: string[], additionalPreloadImages: string[], callback: () => void): void;
}
