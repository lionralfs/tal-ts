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
    private widgetStrip;
    private currentAlignPoint;
    /**
     * @param id The id of the mask
     * @param widgetStrip the strip to be masked
     * @param orientation the orientation of the mask, one of
     * `HorizontalOrientation` or `VerticalOrientation`
     */
    constructor(id: string, widgetStrip: object, orientation: Orientation);
    /**
     * Moves the masked widget strip such that the alignment point of the mask and the alignment
     * point of the indexed widget are the same place
     * @param index Index of the widget to be aligned
     * @param options
     */
    alignToIndex(index: number, options: {
        skipAnim: boolean;
    }): void;
    /**
     * Sets the alignment point of the mask in terms of pixels from its primary edge
     * (left for horizontal, top for vertical)
     * @param pixelsFromEdge
     */
    setAlignPoint(pixelsFromEdge: number): void;
    /**
     * Sets the alignment point of the mask in terms of a value between 0 and 1,
     * with 0 being the top or left edge and 1 being the bottom or right edge
     * @param fractionOfMaskLength Value between 0 and 1, will be clamped to 0 or 1 if outside this range.
     */
    setNormalisedAlignPoint(fractionOfMaskLength: number): void;
    /**
     * Sets the alignment point of the widget in terms of a value between 0 and 1,
     * with 0 being the top or left of the widget and 1 being the bottom or right.
     * @param fractionOfWidgetLength Value between 0 and 1, will be clamped to 0 or 1 if outside this range.
     */
    setNormalisedWidgetAlignPoint(fractionOfWidgetLength: any): void;
    /**
     * @return the widget strip currently being masked
     */
    getWidgetStrip(): any;
    /**
     * Sets the widget strip to mask and align
     * @param widgetStrip an instance of antie.widgets.carousel.strips.WidgetStrip
     */
    setWidgetStrip(widgetStrip: any): void;
    private doAlign(index, options, alignPoint);
    private resetAlignment();
}
