import { Application, IConfigCss, ILayout } from '../application';
import { BaseClass } from '../class';
import { IHistorian } from '../historian';
import { MediaPlayer } from '../mediaplayer/mediaplayer';
import { ISize } from '../widgets/image';
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
        overrides?: {
            clampOffsetFromEndOfRange: number;
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
        horizontalprogress?: {
            animate?: boolean;
        };
    };
    animationDisabled: boolean;
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
    el?: HTMLElement;
    to?: {
        left?: number;
        right?: number;
        opacity?: number;
        top?: number;
    };
    from?: {
        opacity?: number;
    };
    skipAnim?: boolean;
    onComplete?: () => void;
    fps?: number;
    duration?: number;
    easing?: string;
    units?: {
        [key: string]: string;
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
    el: HTMLElement;
}
export interface ILoggingStrategies {
    [key: string]: ILoggingMethods;
}
export interface IAnimator {
    start: () => void;
    stop: () => void;
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
    showElement(options: IShowElementOptions): void;
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
    static addLoggingStrategy(moduleId: string, loggingMethods: ILoggingMethods): void;
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
    /**
     * Get an object giving access to the current URL, query string, hash etc.
     *
     * Returns an Object containing, at a minimum, the properties:
     * hash, host, href, pathname, protocol, search. These correspond to the properties
     * in the window.location DOM API.
     * Use getCurrentAppURL(), getCurrentAppURLParams() and getCurrentRoute() to get
     * this information in a more generic way.
     */
    abstract getWindowLocation(): Location;
    /**
     * Browse to the specified location. Use launchAppFromURL() and setCurrentRoute() under Application
     * to manipulate the current location more easily.
     * @param url Full URL to navigate to, including search and hash if applicable.
     */
    abstract setWindowLocationUrl(url: string): void;
    abstract prependChildElement(to: HTMLElement, el: HTMLElement): void;
    abstract insertChildElementBefore(to: HTMLElement, el: HTMLElement, ref: HTMLElement): void;
    abstract appendChildElement(to: HTMLElement, el: Node): void;
    abstract setElementClasses(el: HTMLElement, classNames: string[]): void;
    abstract removeClassFromElement(el: HTMLElement, className: string, deep?: boolean): void;
    abstract addClassToElement(el: Node, className: string): void;
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
    abstract addKeyEventListener(): void;
    abstract getChildElementsByTagName(el: Node, tagName: string): Node[];
    abstract getTopLevelElement(): Node;
    abstract getStylesheetElements(): Node[];
    abstract getElementOffset(el: HTMLElement): {
        top: number;
        left: number;
        [key: string]: number;
    };
    abstract getElementSize(el: HTMLElement): ISize;
    abstract setElementSize(el: HTMLElement, size: ISize): void;
    abstract setElementContent(el: HTMLElement, content: string, enableHTML?: boolean): void;
    abstract scrollElementTo(options: IAnimOptions): void;
    abstract moveElementTo(options: IAnimOptions): void;
    abstract hideElement(options: IAnimOptions): void;
    abstract showElement(options: IAnimOptions): void;
    abstract tweenElementStyle(options: IAnimOptions): void;
    abstract stopAnimation(animator?: IAnimator): void;
    abstract loadStyleSheet(url: string, callback?: (res: string) => void): void;
    /**
     * Clears the content of an element.
     * @param el The element you are removing the content from.
     */
    abstract clearElement(el: HTMLElement): void;
    abstract createContainer(id?: string, classNames?: string[]): HTMLElement;
    abstract createLabel(id?: string, classNames?: string[], text?: string, enableHTML?: boolean): HTMLElement;
    /**
     * @deprecated
     */
    abstract getTextHeight(text: string, maxWidth: number, classNames: string[]): number;
    abstract createButton(id?: string, classNames?: string[]): HTMLElement;
    abstract createList(id?: string, classNames?: string[]): HTMLElement;
    abstract createListItem(id?: string, classNames?: string[]): HTMLElement;
    abstract isAnimationDisabled(): boolean;
    abstract createImage(src: string, id?: string, classNames?: string[], size?: ISize, onLoad?: (...args: any[]) => void, onError?: (...args: any[]) => void): HTMLImageElement;
    abstract removeElement(el: HTMLElement): void;
    /**
     * Get the media player.
     * This will return the correct implementation for the current device.
     * Returns a MediaPlayer for the current device.
     */
    abstract getMediaPlayer(): MediaPlayer;
    /**
     * Creates an element in the device's user-agent.
     * @param tagName The tag name of the element to create.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     */
    abstract createElement<K extends keyof HTMLElementTagNameMap>(tagName?: K, id?: string, classNames?: string[]): HTMLElementTagNameMap[K];
    /**
     * Gets historian for current location
     * Returns an object that can be used to get a back or forward url between applications while preserving history
     */
    abstract getHistorian(): IHistorian;
    /**
     * Exits to broadcast if this function has been overloaded by a modifier. Otherwise, calls exit().
     */
    abstract exitToBroadcast(): void;
    /**
     * Exits the application directly - no history.
     */
    abstract exit(): void;
}
