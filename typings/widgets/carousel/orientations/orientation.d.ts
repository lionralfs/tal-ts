import { BaseClass } from '../../../class';
export declare abstract class Orientation extends BaseClass {
    abstract dimension(): string;
    abstract edge(): string;
    abstract styleClass(): string;
    abstract defaultKeys(): {
        PREVIOUS: number;
        NEXT: number;
    };
}
