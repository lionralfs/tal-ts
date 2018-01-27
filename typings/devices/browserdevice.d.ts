import { Device, IDevice } from './device';
export declare class BrowserDevice extends Device implements IDevice {
    addKeyEventListener(): void;
    getTopLevelElement(): Node;
    addClassToElement(el: Element, className: string): void;
    preloadImage(url: string): void;
    loadStyleSheet(url: string, callback?: (res: string) => void): void;
    getCurrentRoute(): string[];
    setElementClasses(el: Element, classNames: string[]): void;
    private trim(str);
}
