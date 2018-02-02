import { Orientation } from './orientation';
/**
 * Class to encapsulate any data specific to a horizontal orientation
 */
export declare class HorizontalOrientation extends Orientation {
    dimension(): string;
    edge(): string;
    styleClass(): string;
    defaultKeys(): {
        PREVIOUS: number;
        NEXT: number;
    };
}
export declare const Horizontal: HorizontalOrientation;
