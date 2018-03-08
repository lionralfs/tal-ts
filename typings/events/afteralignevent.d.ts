import { Container } from '..';
import { BaseEvent } from './event';
/**
 * Class of events raised when a Mask is about to change alignment of its widget strip.
 */
export declare class AfterAlignEvent extends BaseEvent {
    target: Container;
    alignedIndex: number;
    /**
     * @param target The mask that is about to align the strip
     * @param alignedIndex
     */
    constructor(target: Container, alignedIndex: number);
}
