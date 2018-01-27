import { IHistoryItem } from './componentcontainer';
import { Container } from './container';
export interface IComponent {
    hide(): void;
    getCurrentState(): IHistoryItem;
    getIsModal(): boolean;
    getConfig(): object;
    isComponent(): boolean;
}
export declare class Component extends Container implements IComponent {
    private isModal;
    constructor(id?: string);
    hide(): void;
    getCurrentState(): any;
    getIsModal(): boolean;
    getConfig(): object;
    isComponent(): boolean;
}
