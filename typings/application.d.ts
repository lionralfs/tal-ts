import { BaseClass } from './class';
import { Device, IDeviceConfig } from './devices/device';
import { BaseEvent } from './events/event';
import { Button } from './widgets/button';
import { Container } from './widgets/container';
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
    bubbleEvent(evt: BaseEvent): void;
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
    constructor(rootElement: Element, styleBaseUrl: string, imageBaseUrl: string, onReadyHandler: (...args: any[]) => void, configOverride?: IDeviceConfig);
    abstract run(): any;
    abstract route(route: string[]): any;
    addComponentContainer(id: any, requireModule: any, args: any): Container;
    showComponent(id: string, requireModule: string, args?: object): void;
    getDevice(): Device;
    bubbleEvent(evt: BaseEvent): void;
    /**
     * Set the currently focussed Button.
     * @param button The button that has recieved focus.
     */
    setFocussedWidget(button: Button): void;
    getBestFitLayout(): ILayout;
    setLayout(layout: ILayout, styleBaseUrl: string, imageBaseUrl: string, additionalCSS: IConfigCss[], additionalClasses: string[], additionalPreloadImages: string[], callback: () => void): void;
    /**
     * Set the root widget of the application.
     * @param widget The new root widget.
     */
    setRootWidget(widget: Container): void;
    getFocussedWidget(): Button;
}
