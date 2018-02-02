import { Container } from '../container';
import { Orientation } from './orientations/orientation';
/**
 * The masking container of a carousel that the widget strip moves within.
 */
export declare class Mask extends Container {
    private orientation;
    private alignmentPoint;
    private normalisedWidgetAlignPoint;
    private normalisedAlignmentPoint;
    private spinner;
    private lastAlignIndex;
    private length;
    /**
     * @param id The id of the mask
     * @param widgetStrip the strip to be masked
     * @param orientation the orientation of the mask, one of
     * `HorizontalOrientation` or `VerticalOrientation`
     */
    constructor(id: string, widgetStrip: object, orientation: Orientation);
}
