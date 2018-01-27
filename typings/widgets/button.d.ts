import { Container } from './container';
export interface IButton extends Container {
}
export declare class Button extends Container implements IButton {
    constructor(id?: string);
}
