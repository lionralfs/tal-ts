import { BaseClass } from '../class';
import { Widget } from '../widgets/widget';
export declare abstract class BaseEvent extends BaseClass {
    static addEventListener(ev: string, func: () => void): void;
    static removeEventListener(ev: string, func: () => void): void;
    static fireEvent(ev: string): void;
    private static eventCount;
    private static eventListeners;
    type: string;
    target: Widget;
    private propagationStopped;
    private defaultPrevented;
    constructor(type: string);
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
}
