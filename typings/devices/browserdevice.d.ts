import { Device, IAnimOptions } from './device';
export declare class BrowserDevice extends Device {
    preloadImage(url: string): void;
    getCurrentRoute(): string[];
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
    scrollElementTo(options: IAnimOptions): void;
    moveElementTo(options: IAnimOptions): void;
    hideElement(options: IAnimOptions): void;
    showElement(options: IAnimOptions): void;
    tweenElementStyle(options: IAnimOptions): void;
    stopAnimation(anim: object): void;
    loadStyleSheet(url: string, callback?: (res: string) => void): void;
    clearElement(el: HTMLElement): void;
    /**
     * Sets the inner content of an element.
     * @param el The element of which to change the content.
     * @param content The new content for the element.
     */
    setElementContent(el: HTMLElement, content: string, enableHTML: boolean): void;
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
     */
    createLabel(id?: string, classNames?: string[], text?: string, enableHTML?: boolean): Node;
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
     * @returns A list within the device's user-agent.
     */
    createList(id?: string, classNames?: string[]): Node;
    /**
     * Creates a list item in the device's user-agent.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     */
    createListItem(id?: string, classNames?: string[]): Node;
    /**
     * Creates an image in the device's user-agent.
     * @param src The source URL of the image.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     * @param size The size of the image.
     * @param onLoad The image.onload callback
     * @param onError The image.onerror callback
     */
    createImage(src: string, id?: string, classNames?: string[], size?: {
        width?: number;
        height?: number;
    }, onLoad?: (...args: any[]) => void, onError?: (...args: any[]) => void): Node;
    /**
     * Removes an element from its parent.
     * @param el The element to remove.
     */
    removeElement(el: HTMLElement): void;
    private trim(str);
    /**
     * Creates an element in the device's user-agent.
     * @param tagName The tag name of the element to create.
     * @param id The id of the element to create.
     * @param classNames An array of class names to apply to the element.
     */
    private createElement<K>(tagName?, id?, classNames?);
}
