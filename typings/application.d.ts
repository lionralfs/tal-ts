import { BaseClass } from './class';
import { Device, IDeviceConfig } from './devices/device';
import { BaseEvent } from './events/event';
import { Button } from './widgets/button';
import { Component } from './widgets/component';
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
    addComponentContainer(id: any, module?: string, args?: object): any;
    showComponent(id: string, component: Component, args?: object): void;
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
    constructor(rootElement: Element, styleBaseUrl: string, imageBaseUrl: string, onReadyHandler?: (...args: any[]) => void, configOverride?: IDeviceConfig);
    abstract run(): any;
    abstract route(route: string[]): any;
    /**
     * Must be called when the application startup is complete and application can accept user input.
     */
    ready(): void;
    addComponentContainer(id: string, requireModule?: string, args?: object): Container;
    addComponentContainer2(id: string, component?: Component, args?: object): Container;
    showComponent(id: string, component: Component, args?: object): void;
    /**
     * Pushes a component into the history stack of a container (and shows it).
     * @param id The ID of the container into which to show the component.
     * @param modules The requirejs module name of the component to show.
     * @param args An optional object to pass arguments to the component.
     */
    pushComponent(id: string, module: string, args?: object): void;
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
    /**
     * Get the root widget of the application.
     *
     * Returns the root widget of the application.
     */
    getRootWidget(): Container;
    getFocussedWidget(): Button;
    /**
     * Removes an event listener from the root widget.
     * @param evt The event to handle.
     * @param handler The handler function to remove.
     */
    removeEventListener(evt: string, handler: (...args: any[]) => void): void;
    /**
     * Destroys the application, allowing you to run another. This is mainly for use when building
     * unit or BDD tests.
     */
    destroy(): void;
    /**
     * Navigates back to whatever launched the application (a parent TAL application, broadcast, or exit).
     */
    back(): void;
    /**
     * Returns a Boolean value to indicate whether the application can go back to a parent TAL application.
     * Returns `true` if the application can return to a parent TAL application.
     */
    hasHistory(): boolean;
    /**
     * Exits the application by using the configured exit strategy for the device, even if there is a parent TAL
     * application in the history stack. Will exit to broadcast if the first TAL application was launched from
     * broadcast and a broadcast exit modifier is loaded.
     */
    exit(): void;
}
