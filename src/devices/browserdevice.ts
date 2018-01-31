import { KeyEvent } from '../events/keyevent';
import { Historian } from '../historian';
import { Device, IAnimOptions, IDevice } from './device';

export class BrowserDevice extends Device {
  public preloadImage(url: string) {
    const img = new Image();
    img.src = url;
  }

  public getCurrentRoute() {
    const unescaped = decodeURI(window.location.hash).split(Historian.HISTORY_TOKEN, 1)[0];
    return unescaped.replace(/^#/, '').split('/');
  }

  public appendChildElement(to: Element, el: Element) {
    to.appendChild(el);
  }

  public setElementClasses(el: Element, classNames: string[]) {
    el.className = classNames.join(' ');
  }

  /**
   * Removes a class from an element (and optionally descendants)
   * @param el The element from which to remove the class.
   * @param className The class to remove.
   * @param deep If true, and this element has the given class, remove the class from it's children recursively.
   */
  public removeClassFromElement(el: Element, className: string, deep?: boolean) {
    if (new RegExp(` ${className} `).test(` ${el.className} `)) {
      el.className = this.trim(` ${el.className} `.replace(` ${className} `, ' '));
    }
    if (deep) {
      // set up recursion
      // tslint:disable-next-line
      for (let i = 0; i < el.childNodes.length; i++) {
        this.removeClassFromElement(el.childNodes[i] as Element, className, true);
      }
    }
  }

  /**
   * Adds a class name to an element
   * @param el The element which will receive new class name.
   * @param className The new class name to add.
   */
  public addClassToElement(el: Element, className: string) {
    this.removeClassFromElement(el, className, false);
    el.className = this.trim(`${el.className} ${className}`);
  }

  /**
   * Adds global key event listener(s) to the user-agent.
   * This must be added in a way that all key events within the user-agent
   * cause this.application.bubbleEvent(...) to be called with a {@link KeyEvent}
   * object with the mapped keyCode.
   */
  public addKeyEventListener() {
    const keyMap = this.getKeyMap();
    const pressed = {};

    // We need to normalise these events on so that for every key pressed there's
    // one keydown event, followed by multiple keypress events whilst the key is
    // held down, followed by a single keyup event.

    document.onkeydown = e => {
      // e = e || window.event;
      const keyCode: number = keyMap[e.keyCode.toString()];
      if (keyCode) {
        if (!pressed[e.keyCode.toString()]) {
          this.application.bubbleEvent(new KeyEvent('keydown', keyCode));
          pressed[e.keyCode.toString()] = true;
        } else {
          this.application.bubbleEvent(new KeyEvent('keypress', keyCode));
        }
        e.preventDefault();
      }
    };

    document.onkeyup = e => {
      // e = e || window.event;
      const keyCode: number = keyMap[e.keyCode.toString()];
      if (keyCode) {
        delete pressed[e.keyCode.toString()];
        this.application.bubbleEvent(new KeyEvent('keyup', keyCode));
        e.preventDefault();
      }
    };

    document.onkeypress = e => {
      // e = e || window.event;
      const keyCode: number = keyMap[e.keyCode.toString()];
      if (keyCode) {
        this.application.bubbleEvent(new KeyEvent('keypress', keyCode));
        e.preventDefault();
      }
    };
  }

  /**
   * Returns all direct children of an element which have the provided tagName.
   * @param el The element who's children you wish to search.
   * @param tagName The tag name you are looking for.
   */
  public getChildElementsByTagName(el: Node, tagName: string) {
    const children: Element[] = [];
    const name = tagName.toLowerCase();
    // tslint:disable-next-line
    for (var i = 0; i < el.childNodes.length; i++) {
      const element = el.childNodes[i] as Element;
      if (element.tagName) {
        if (element.tagName.toLowerCase() === name) {
          children.push(element);
        }
      }
    }
    return children;
  }

  /**
   * Returns the top-level DOM element. This is the target of layout class names.
   */
  public getTopLevelElement(): Node {
    return document.documentElement || document.body.parentNode || document;
  }

  /**
   * Returns all the loaded stylesheet elements, an array containing all stylesheet
   * related DOM elements (link and style elements)
   */
  public getStylesheetElements(): Node[] {
    const stylesheetElements: Node[] = [];

    const linkElements = document.getElementsByTagName('link');
    const styleElements = document.getElementsByTagName('style');

    // Loop over the node lists and push the dom elements into an array
    // tslint:disable-next-line
    for (let i = 0; i < linkElements.length; i++) {
      stylesheetElements.push(linkElements[i]);
    }

    // tslint:disable-next-line
    for (let i = 0; i < styleElements.length; i++) {
      stylesheetElements.push(styleElements[i]);
    }

    return stylesheetElements;
  }

  /**
   * Returns the offset of the element within its offset container.
   * @param el The element you wish to know the offset of.
   */
  public getElementOffset(el: HTMLElement): { top: number; left: number } {
    return {
      top: el.offsetTop,
      left: el.offsetLeft
    };
  }

  /**
   * Returns a size object containing the width and height of the element.
   * @param el The element of which to return the size.
   */
  public getElementSize(el: HTMLElement): { width: number; height: number } {
    return {
      width: el.clientWidth || el.offsetWidth,
      height: el.clientHeight || el.offsetHeight
    };
  }

  /**
   * Sets the size of an element.
   * @param el The element of which to set the size.
   * @param size The new size of the element.
   */
  public setElementSize(el: HTMLElement, size: { width?: number; height?: number }) {
    if (size.width !== undefined) {
      el.style.width = size.width + 'px';
    }
    if (size.height !== undefined) {
      el.style.height = size.height + 'px';
    }
  }

  public scrollElementTo(options: IAnimOptions) {}

  public moveElementTo(options: IAnimOptions) {}

  public hideElement(options: IAnimOptions) {}

  public showElement(options: IAnimOptions) {}

  public tweenElementStyle(options: IAnimOptions) {} // TODO: check options

  public stopAnimation(anim: object) {} // TODO: implement anim interface

  public loadStyleSheet(url: string, callback?: (res: string) => void) {
    const supportsCssRules = (): boolean => {
      document.createElement('style');
      const style = this.createElement('style');
      style.type = 'text/css';
      style.innerHTML = 'body {};';
      style.className = 'added-by-antie';
      document.getElementsByTagName('head')[0].appendChild(style);
      const styleTest: any = style; // Workaround for TS Error: Property 'cssRules' does not exist on type 'StyleSheet'.
      if (styleTest.sheet && styleTest.sheet.cssRules) {
        return true;
      }
      this.removeElement(style);
      return false;
    };

    if (callback && supportsCssRules()) {
      const style = this.createElement('style');
      style.type = 'text/css';
      style.innerHTML = "@import url('" + url + "');";
      style.className = 'added-by-antie';
      document.getElementsByTagName('head')[0].appendChild(style);
      const interval = window.setInterval(() => {
        const styleTest: any = style; // Workaround for TS Error: Property 'cssRules' does not exist on type 'StyleSheet'.
        if (styleTest.sheet && styleTest.sheet.cssRules) {
          window.clearInterval(interval);
        } else {
          return;
        }
        callback(url);
      }, 200);
    } else {
      const link = this.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      link.className = 'added-by-antie';
      document.getElementsByTagName('head')[0].appendChild(link);
      // Onload trickery from:
      // http://www.backalleycoder.com/2011/03/20/link-tag-css-stylesheet-load-event/
      if (callback) {
        const img = this.createElement('img');
        const done = () => {
          img.onerror = () => null;
          callback(url);
          this.removeElement(img);
        };
        img.onerror = done;
        this.getTopLevelElement().appendChild(img);
        img.src = url;
      }
    }
  }

  public clearElement(el: HTMLElement) {
    for (let i = el.childNodes.length - 1; i >= 0; i--) {
      el.removeChild(el.childNodes[i]);
    }
  }

  /**
   * Sets the inner content of an element.
   * @param el The element of which to change the content.
   * @param content The new content for the element.
   */
  public setElementContent(el: HTMLElement, content: string, enableHTML: boolean): void {
    if (content === '') {
      this.clearElement(el);
      return;
    }

    el[enableHTML ? 'innerHTML' : 'textContent'] = content;
  }

  /**
   * Creates a generic container element in the device's user-agent.
   * @param id The id of the element to create.
   * @param classNames An array of class names to apply to the element.
   */
  public createContainer(id?: string, classNames?: string[]): HTMLElement {
    return this.createElement('div', id, classNames);
  }

  /**
   * Creates a label (an element that only contains text) in the device's user-agent.
   * @param id The id of the element to create.
   * @param classNames An array of class names to apply to the element.
   * @param text The text within the label.
   */
  public createLabel(id?: string, classNames?: string[], text?: string, enableHTML?: boolean): Node {
    const el = this.createElement('span', id, classNames);
    this.setElementContent(el, text, enableHTML);
    return el;
  }

  /**
   * Creates a button (an element that can be selected by the user to perform an action) in the device's user-agent.
   * @param id The id of the element to create.
   * @param classNames An array of class names to apply to the element.
   */
  public createButton(id?: string, classNames?: string[]): HTMLElement {
    return this.createElement('div', id, classNames);
  }

  /**
   * Creates a list in the device's user-agent.
   * @param id The id of the element to create.
   * @param classNames An array of class names to apply to the element.
   * @returns A list within the device's user-agent.
   */
  public createList(id?: string, classNames?: string[]): Node {
    return this.createElement('ul', id, classNames);
  }

  /**
   * Creates a list item in the device's user-agent.
   * @param id The id of the element to create.
   * @param classNames An array of class names to apply to the element.
   */
  public createListItem(id?: string, classNames?: string[]): Node {
    return this.createElement('li', id, classNames);
  }

  /**
   * Creates an image in the device's user-agent.
   * @param src The source URL of the image.
   * @param id The id of the element to create.
   * @param classNames An array of class names to apply to the element.
   * @param size The size of the image.
   * @param onLoad The image.onload callback
   * @param onError The image.onerror callback
   */
  public createImage(
    src: string,
    id?: string,
    classNames?: string[],
    size?: { width?: number; height?: number },
    onLoad?: (...args: any[]) => void,
    onError?: (...args: any[]) => void
  ): Node {
    const el = this.createElement('img', id, classNames);
    el.src = src;
    el.alt = '';
    if (size) {
      this.setElementSize(el, size);
    }
    if (onLoad !== undefined) {
      el.onload = onLoad;
    }
    if (onError !== undefined) {
      el.onerror = onError;
    }
    return el;
  }

  /**
   * Removes an element from its parent.
   * @param el The element to remove.
   */
  public removeElement(el: HTMLElement) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  private trim(str: string): string {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  /**
   * Creates an element in the device's user-agent.
   * @param tagName The tag name of the element to create.
   * @param id The id of the element to create.
   * @param classNames An array of class names to apply to the element.
   */
  private createElement<K extends keyof HTMLElementTagNameMap>(
    tagName?: K,
    id?: string,
    classNames?: string[]
  ): HTMLElementTagNameMap[K] {
    const el = document.createElement(tagName);

    // don't add auto-generated IDs to the DOM
    if (id && id.substring(0, 1) !== '#') {
      el.id = id;
    }
    if (classNames && classNames.length > 0) {
      el.className = classNames.join(' ');
    }
    return el;
  }
}
