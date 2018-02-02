import { Orientation } from './orientation';
/**
 * Class to encapsulate any data specific to a vertical orientation
 */
export declare class VerticalOrientation extends Orientation {
    dimension(): string;
    edge(): string;
    styleClass(): string;
    defaultKeys(): {
        PREVIOUS: number;
        NEXT: number;
    };
}
export declare const Vertical: VerticalOrientation;
