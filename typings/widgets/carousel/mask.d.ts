import { Container } from '../container';
import { Orientation } from './orientations/orientation';
import { WidgetStrip } from './strips/widgetstrip';
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
    setNormalisedWidgetAlignPoint(fractionOfWidgetLength: number): void;
    /**
     * @return the widget strip currently being masked
     */
    getWidgetStrip(): WidgetStrip;
    /**
     * Sets the widget strip to mask and align
     * @param widgetStrip an instance of antie.widgets.carousel.strips.WidgetStrip
     */
    setWidgetStrip(widgetStrip: WidgetStrip): void;
    setLength(length: number): void;
    /**
     * @return The length in pixels of the primary dimension of the mask
     * (Width for horizontal, height for vertical)
     */
    getLength(): number;
    /**
     * @param index
     * @return  An array of indices corresponding to the widgets visible
     * when the specified index is aligned to the current alignment point.
     */
    indicesVisibleWhenAlignedToIndex(index: number): number[];
    /**
     * Completes any current alignment operation instantly, firing any associated
     * onComplete callback
     */
    stopAnimation(): void;
    beforeAlignTo(currentIndex: number, newIndex: number): void;
    afterAlignTo(index: number): void;
    private clampBetweenZeroAndOne(value);
    private getWidgetAlignmentPoint(index);
    private getAlignmentPoint();
    private visibleIndixesBefore(index, maskLength);
    private visibleIndicesFrom(index, maskLength);
    private visibleIndicesBetween(start, end);
    private deDuplicateAndSortArray(arr);
    private numericalSort(a, b);
    private moveContentsTo(relativePixels, options);
    private getDimension();
    private doAlign(index, options, alignPoint);
    private resetAlignment();
}
