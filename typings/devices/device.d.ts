import { Application, IConfigCss, ILayout } from '../application';
import { BaseClass } from '../class';
import { IShowOptions } from '../widgets/widget';
export interface IDeviceConfig {
    pageStrategy?: string;
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
    streaming?: {
        video?: {
            mediaURIFormat: string;
            supported: ISupportedVideoStreaming[];
        };
        audio?: {
            mediaURIFormat: string;
            supported: ISupportedAudioStreaming[];
        };
    };
    accessibility?: {
        captions: {
            supported: string[];
        };
    };
    layouts?: ILayout[];
    networking: {
        supportsJSONP: boolean;
    };
    capabilities: string[];
    statLabels: {
        deviceType?: string;
        serviceType?: string;
        browserType?: string;
    };
    widgets?: {
        componentcontainer?: {
            fade?: boolean;
        };
    };
}
export interface ISupportedVideoStreaming {
    protocols: string[];
    encodings: string[];
    transferFormat: string[];
    maximumBitRate: number;
    maximumVideoLines: number;
}
export interface ISupportedAudioStreaming {
    protocols: string[];
    encodings: string[];
    maximumBitRate: number;
}
export interface IAnimOptions {
    el: Node;
    to?: {
        left?: number;
        right?: number;
    };
    skipAnim?: boolean;
    onComplete?: () => void;
    fps?: number;
    duration?: number;
    easing?: string;
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
    getTopLevelElement(): Node;
    preloadImage(url: string): void;
    getCurrentRoute(): string[];
    appendChildElement(to: Node, el: Node): void;
    setElementClasses(el: Node, classNames: string[]): void;
    removeClassFromElement(el: Node, className: string, deep?: boolean): void;
    addClassToElement(el: Node, className: string): void;
    addKeyEventListener(): void;
    getChildElementsByTagName(el: Node, tagName: string): Node[];
    showElement(options: IShowElementOptions): object;
    loadStyleSheet(url: string, callback: (res?: string) => void): void;
    clearElement(el: HTMLElement): void;
    getConfig(): object;
    getLogger(): ILoggingMethods;
    getKeyMap(): {
        [key: string]: number;
    };
}
export declare abstract class Device extends BaseClass implements IDevice {
    static load(config: IDeviceConfig, callbacks: IDeviceCallbacks): void;
    static addLoggingMethod(moduleId: string, loggingMethods: object): void;
    private static loggingStrategies;
    private static filteredLoggingMethods;
    protected application: Application;
    private config;
    private keyMap;
    constructor(config: IDeviceConfig);
    setApplication(app: Application): void;
    getConfig(): IDeviceConfig;
    getLogger(): ILoggingMethods;
    getKeyMap(): {
        [key: string]: number;
    };
    abstract preloadImage(url: string): void;
    abstract getCurrentRoute(): string[];
    abstract appendChildElement(to: Node, el: Node): void;
    abstract setElementClasses(el: Node, classNames: string[]): void;
    abstract removeClassFromElement(el: Node, className: string, deep?: boolean): void;
    abstract addClassToElement(el: Node, className: string): any;
    /**
     * Adds global key event listener(s) to the user-agent.
     * This must be added in a way that all key events within the user-agent
     * cause self._application.bubbleEvent(...) to be called with a {@link KeyEvent}
     * object with the mapped keyCode.
     *
     * @example
     * document.onkeydown = function(e) {
     *     self._application.bubbleEvent(new KeyEvent('keydown', keyMap[e.keyCode]));
     * };
     */
    abstract addKeyEventListener(): any;
    abstract getChildElementsByTagName(el: Node, tagName: string): Node[];
    abstract getTopLevelElement(): Node;
    abstract getStylesheetElements(): Node[];
    abstract getElementOffset(el: HTMLElement): {
        top: number;
        left: number;
    };
    abstract getElementSize(el: HTMLElement): {
        width: number;
        height: number;
    };
    abstract setElementSize(el: HTMLElement, size: {
        width?: number;
        height?: number;
    }): void;
    abstract scrollElementTo(options: IAnimOptions): any;
    abstract moveElementTo(options: IAnimOptions): any;
    abstract hideElement(options: IAnimOptions): any;
    abstract showElement(options: IAnimOptions): any;
    abstract tweenElementStyle(options: IAnimOptions): any;
    abstract stopAnimation(anim: object): any;
    abstract loadStyleSheet(url: string, callback?: (res: string) => void): void;
    /**
     * Clears the content of an element.
     * @param el The element you are removing the content from.
     */
    abstract clearElement(el: HTMLElement): void;
    abstract createContainer(id?: string, classNames?: string[]): HTMLElement;
    abstract createLabel(id?: string, classNames?: string[], text?: string): Node;
    abstract createButton(id?: string, classNames?: string[]): HTMLElement;
    abstract createList(id?: string, classNames?: string[]): Node;
    abstract createListItem(id?: string, classNames?: string[]): Node;
    abstract createImage(src: string, id?: string, classNames?: string[], size?: {
        width?: number;
        height?: number;
    }, onLoad?: (...args: any[]) => void, onError?: (...args: any[]) => void): Node;
    abstract removeElement(el: HTMLElement): void;
}
