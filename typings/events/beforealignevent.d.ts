import { WidgetStrip } from '../widgets/carousel/strips/widgetstrip';
import { BaseEvent } from './event';
/**
 * Class of events raised when a Mask is about to change alignment of its widget strip.
 */
export declare class BeforeAlignEvent extends BaseEvent {
    target: WidgetStrip;
    alignedIndex: number;
    /**
     * @param target The mask that is about to align the strip
     * @param alignedIndex
     */
    constructor(target: WidgetStrip, alignedIndex: number);
}
