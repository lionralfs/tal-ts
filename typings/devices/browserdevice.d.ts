import { Historian } from '../historian';
import { MediaPlayer } from '../mediaplayer/mediaplayer';
import { ISize } from '../widgets/image';
import { Device, IAnimator, IAnimOptions } from './device';
export declare class BrowserDevice extends Device {
    private mediaPlayer;
    private windowLocation;
    preloadImage(url: string): void;
    getCurrentRoute(): string[];
    getWindowLocation(): Location;
    /**
     * Browse to the specified location. Use launchAppFromURL() and setCurrentRoute() under Application
     * to manipulate the current location more easily.
     * @param url Full URL to navigate to, including search and hash if applicable.
     */
    setWindowLocationUrl(url: string): void;
    /**
     * Prepends an element as a child of another.
     * @param to Prepend as a child of this element.
     * @param el The new child element.
     */
    prependChildElement(to: HTMLElement, el: HTMLElement): void;
    /**
     * Inserts an element as a child of another before a reference element.
     * @param to Append as a child of this element.
     * @param el The new child element.
     * @param ref The reference element which will appear after the inserted element.
     */
    insertChildElementBefore(to: HTMLElement, el: HTMLElement, ref: HTMLElement): void;
    appendChildElement(to: Element, el: Element): void;
    setElementClasses(el: Element, classNames: string[]): void;
    /**
     * Removes a class from an element (and optionally descendants)
     * @param el The element from which to remove the class.
     * @param className The class to remove.
     * @param deep If true, and this element has the given class, remove the class from it's children recursively.
     */
    removeClassFromElement(el: Element, className: string, deep?: boolean): void;
    /**
     * Adds a class name to an element
     * @param el The element which will receive new class name.
     * @param className The new class name to add.
     */
    addClassToElement(el: Element, className: string): void;
    /**
     * Adds global key event listener(s) to the user-agent.
     * This must be added in a way that all key events within the user-agent
     * cause this.application.bubbleEvent(...) to be called with a {@link KeyEvent}
     * object with the mapped keyCode.
     */
    addKeyEventListener(): void;
    /**
     * Returns all direct children of an element which have the provided tagName.
     * @param el The element who's children you wish to search.
     * @param tagName The tag name you are looking for.
     */
    getChildElementsByTagName(el: Node, tagName: string): Element[];
    /**
     * Returns the top-level DOM element. This is the target of layout class names.
     */
    getTopLevelElement(): Node;
    /**
     * Returns all the loaded stylesheet elements, an array containing all stylesheet
     * related DOM elements (link and style elements)
     */
    getStylesheetElements(): Node[];
    /**
     * Returns the offset of the element within its offset container.
     * @param el The element you wish to know the offset of.
     */
    getElementOffset(el: HTMLElement): {
        top: number;
        left: number;
    };
    /**
     * Returns a size object containing the width and height of the element.
     * @param el The element of which to return the size.
     */
    getElementSize(el: HTMLElement): {
        width: number;
        height: number;
    };
    /**
     * Sets the size of an element.
     * @param el The element of which to set the size.
     * @param size The new size of the element.
     */
    setElementSize(el: HTMLElement, size: {
        width?: number;
        height?: number;
    }): void;
    scrollElementTo(options: IAnimOptions): IAnimator;
    moveElementTo(options: IAnimOptions): IAnimator;
    hideElement(options: IAnimOptions): IAnimator;
    showElement(options: IAnimOptions): IAnimator;
    tweenElementStyle(options: IAnimOptions): IAnimator;
    stopAnimation(animator?: IAnimator): void;
    isAnimationDisabled(): boolean;
    loadStyleSheet(url: string, callback?: (res: string) => void): void;
    clearElement(el: HTMLElement): void;
    /**
     * Sets the inner content of an element.
     * @param el The element of which to change the content.
     * @param content The new content for the element.
     */
    setElementContent(el: HTMLElement, content: string, enableHTML?: boolean): void;
    /**
     * Get the height (in pixels) of a given block of text (of a provided set of class names) when constrained to a fixed width.
     *
     * @deprecated This function does not always give accurate results. When measuring size, it only takes into account
     * the classes on the text element being measured. It doesn't consider any CSS styles that may have been passed down
     * through the DOM.
     *
     * Returns the height (in pixels) that is required to display this block of text.
     *
     * @param text The text to measure.
     * @param maxWidth The width the text is constrained to.
     * @param classNames An array of class names which define the style of the text.
     */
    getTextHeight(text: string, maxWidth: number, classNames: string[]): number;
    /**
     * Creates a generic container element in the device's user-agent.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     */
    createContainer(id?: string, classNames?: string[]): HTMLElement;
    /**
     * Creates a label (an element that only contains text) in the device's user-agent.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     * @param text The text within the label.
     * @param enableHTML Interpret text as html
     */
    createLabel(id?: string, classNames?: string[], text?: string, enableHTML?: boolean): HTMLElement;
    /**
     * Creates a button (an element that can be selected by the user to perform an action) in the device's user-agent.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     */
    createButton(id?: string, classNames?: string[]): HTMLElement;
    /**
     * Creates a list in the device's user-agent.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     * @return A list within the device's user-agent.
     */
    createList(id?: string, classNames?: string[]): HTMLElement;
    /**
     * Creates a list item in the device's user-agent.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     */
    createListItem(id?: string, classNames?: string[]): HTMLElement;
    /**
     * Creates an image in the device's user-agent.
     * @param src The source URL of the image.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     * @param size The size of the image.
     * @param onLoad The image.onload callback
     * @param onError The image.onerror callback
     */
    createImage(src: string, id?: string, classNames?: string[], size?: ISize, onLoad?: (...args: any[]) => void, onError?: (...args: any[]) => void): HTMLImageElement;
    /**
     * Removes an element from its parent.
     * @param el The element to remove.
     */
    removeElement(el: HTMLElement): void;
    getMediaPlayer(): MediaPlayer;
    /**
     * Creates an element in the device's user-agent.
     * @param tagName The tag name of the element to create.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     */
    createElement<K extends keyof HTMLElementTagNameMap>(tagName?: K, id?: string, classNames?: string[]): HTMLElementTagNameMap[K];
    getHistorian(): Historian;
    /**
     * Exits to broadcast if this function has been overloaded by a modifier. Otherwise, calls exit().
     */
    exitToBroadcast(): void;
    /**
     * Exits the application by invoking the window.close method
     */
    exit(): void;
    private trim(str);
}
