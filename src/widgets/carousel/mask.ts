import { Device } from '../..';
import { IAnimOptions } from '../../devices/device';
import { AfterAlignEvent } from '../../events/afteralignevent';
import { BeforeAlignEvent } from '../../events/beforealignevent';
import { Container } from '../container';
import { ISize } from '../image';
import { Orientation } from './orientations/orientation';
import { Spinner } from './spinner';
import { WidgetStrip } from './strips/widgetstrip';

/**
 * The masking container of a carousel that the widget strip moves within.
 */
export class Mask extends Container {
  private orientation: Orientation;
  private alignmentPoint: number;
  private normalisedWidgetAlignPoint: number;
  private normalisedAlignmentPoint: number;
  private spinner: Spinner;
  private lastAlignIndex: number;
  private length: number;
  private widgetStrip: WidgetStrip;
  private currentAlignPoint: number;

  /**
   * @param id The id of the mask
   * @param widgetStrip the strip to be masked
   * @param orientation the orientation of the mask, one of
   * `HorizontalOrientation` or `VerticalOrientation`
   */
  constructor(id: string, widgetStrip: WidgetStrip, orientation: Orientation) {
    super(id);

    this.addClass(orientation.styleClass());
    this.addClass('carouselmask');
    this.orientation = orientation;
    this.setWidgetStrip(widgetStrip);
    this.alignmentPoint = 0;
    this.normalisedWidgetAlignPoint = 0;
    this.normalisedAlignmentPoint = 0;
    this.spinner = new Spinner(this.getCurrentApplication().getDevice(), this, orientation);
    this.lastAlignIndex = null;
    this.length = undefined;
  }

  /**
   * Moves the masked widget strip such that the alignment point of the mask and the alignment
   * point of the indexed widget are the same place
   * @param index Index of the widget to be aligned
   * @param options
   */
  public alignToIndex(index: number, options: { skipAnim: boolean }) {
    this.doAlign(index, options, this.alignmentPoint);
  }

  /**
   * Sets the alignment point of the mask in terms of pixels from its primary edge
   * (left for horizontal, top for vertical)
   * @param pixelsFromEdge
   */
  public setAlignPoint(pixelsFromEdge: number) {
    this.alignmentPoint = pixelsFromEdge;
    this.normalisedAlignmentPoint = 0;
  }

  /**
   * Sets the alignment point of the mask in terms of a value between 0 and 1,
   * with 0 being the top or left edge and 1 being the bottom or right edge
   * @param fractionOfMaskLength Value between 0 and 1, will be clamped to 0 or 1 if outside this range.
   */
  public setNormalisedAlignPoint(fractionOfMaskLength: number) {
    const clampedFraction = this.clampBetweenZeroAndOne(fractionOfMaskLength);
    this.normalisedAlignmentPoint = clampedFraction;
  }

  /**
   * Sets the alignment point of the widget in terms of a value between 0 and 1,
   * with 0 being the top or left of the widget and 1 being the bottom or right.
   * @param fractionOfWidgetLength Value between 0 and 1, will be clamped to 0 or 1 if outside this range.
   */
  public setNormalisedWidgetAlignPoint(fractionOfWidgetLength: number) {
    this.normalisedWidgetAlignPoint = this.clampBetweenZeroAndOne(fractionOfWidgetLength);
  }

  /**
   * @return the widget strip currently being masked
   */
  public getWidgetStrip(): WidgetStrip {
    return this.widgetStrip;
  }

  /**
   * Sets the widget strip to mask and align
   * @param widgetStrip an instance of WidgetStrip
   */
  public setWidgetStrip(widgetStrip: WidgetStrip) {
    if (this.widgetStrip) {
      this.removeChildWidget(this.widgetStrip);
    }
    this.widgetStrip = widgetStrip;
    this.appendChildWidget(this.widgetStrip);
  }

  public setLength(length: number) {
    this.length = length;
  }

  /**
   * @return The length in pixels of the primary dimension of the mask
   * (Width for horizontal, height for vertical)
   */
  public getLength(): number {
    if (this.length) {
      return this.length;
    } else {
      const device: Device = this.getCurrentApplication().getDevice();
      const size: ISize = device.getElementSize(this.outputElement || this.render(device));
      return size[this.getDimension()];
    }
  }

  /**
   * @param index
   * @return  An array of indices corresponding to the widgets visible
   * when the specified index is aligned to the current alignment point.
   */
  public indicesVisibleWhenAlignedToIndex(index: number): number[] {
    const maskLength = this.getLength();
    const visibleIndices = this.visibleIndixesBefore(index, maskLength).concat(
      this.visibleIndicesFrom(index, maskLength)
    );
    return visibleIndices;
  }

  /**
   * Completes any current alignment operation instantly, firing any associated
   * onComplete callback
   */
  public stopAnimation() {
    this.spinner.stopAnimation();
  }

  public beforeAlignTo(currentIndex: number, newIndex: number) {
    if (this.widgetStrip.needsVisibleIndices()) {
      this.widgetStrip.attachIndexedWidgets(this.visibleIndicesBetween(currentIndex, newIndex));
      this.resetAlignment();
    }
    this.widgetStrip.bubbleEvent(new BeforeAlignEvent(this.widgetStrip, newIndex));
  }

  public afterAlignTo(index: number) {
    this.lastAlignIndex = index;
    if (this.widgetStrip.needsVisibleIndices()) {
      this.widgetStrip.attachIndexedWidgets(this.indicesVisibleWhenAlignedToIndex(index));
      this.alignToIndex(index, { skipAnim: true });
    }
    this.widgetStrip.bubbleEvent(new AfterAlignEvent(this.widgetStrip, index));
  }

  private clampBetweenZeroAndOne(value: number): number {
    let clampedValue = value;
    clampedValue = Math.max(0, clampedValue);
    clampedValue = Math.min(1, clampedValue);
    return clampedValue;
  }

  private getWidgetAlignmentPoint(index: number): number {
    let widgetLength: number;
    let widgetAlignmentPoint: number;
    if (this.normalisedWidgetAlignPoint === 0) {
      widgetAlignmentPoint = 0;
    } else {
      widgetLength = this.widgetStrip.lengthOfWidgetAtIndex(index);
      widgetAlignmentPoint = widgetLength * this.normalisedWidgetAlignPoint;
    }

    return widgetAlignmentPoint;
  }

  private getAlignmentPoint(): number {
    return this.normalisedAlignmentPoint === 0 ? this.alignmentPoint : this.getLength() * this.normalisedAlignmentPoint;
  }

  private visibleIndixesBefore(index: number, maskLength: number): number[] {
    let distanceToMaskStart = this.getAlignmentPoint() - this.getWidgetAlignmentPoint(index);
    let currentIndex = index - 1;
    const indices: number[] = [];
    while (currentIndex !== -1 && distanceToMaskStart > 0) {
      if (distanceToMaskStart <= maskLength) {
        indices.unshift(currentIndex);
      }
      distanceToMaskStart -= this.getWidgetStrip().lengthOfWidgetAtIndex(currentIndex);
      currentIndex -= 1;
    }
    return indices;
  }

  private visibleIndicesFrom(index: number, maskLength: number): number[] {
    const widgetCount = this.getWidgetStrip().getChildWidgetCount();
    let distanceToMaskEnd = maskLength - this.getAlignmentPoint() + this.getWidgetAlignmentPoint(index);
    let currentIndex = index;
    const indices: number[] = [];
    while (currentIndex !== widgetCount && distanceToMaskEnd > 0) {
      if (distanceToMaskEnd <= maskLength) {
        indices.push(currentIndex);
      }
      distanceToMaskEnd -= this.getWidgetStrip().lengthOfWidgetAtIndex(currentIndex);
      currentIndex += 1;
    }
    return indices;
  }

  private visibleIndicesBetween(start: number, end: number): number[] {
    const startIndices = start === null ? [] : this.indicesVisibleWhenAlignedToIndex(start);
    const endIndices = this.indicesVisibleWhenAlignedToIndex(end);
    let combinedIndices = startIndices.concat(endIndices);
    combinedIndices = this.deDuplicateAndSortArray(combinedIndices);
    const visibleIndices: number[] = [];

    if (combinedIndices.length > 0) {
      const first = combinedIndices[0];
      const last = combinedIndices[combinedIndices.length - 1];
      for (let i = first; i !== last + 1; i += 1) {
        visibleIndices.push(i);
      }
    }
    return visibleIndices;
  }

  private deDuplicateAndSortArray(arr: number[]) {
    const deDuped: number[] = [];
    arr.sort(this.numericalSort);
    for (let i = 0; i !== arr.length; i += 1) {
      if (arr[i] !== arr[i + 1]) {
        deDuped.push(arr[i]);
      }
    }
    return deDuped;
  }

  private numericalSort(a: number, b: number) {
    return a - b;
  }

  private moveContentsTo(relativePixels: number, options: IAnimOptions) {
    this.spinner.moveContentsTo(relativePixels, options);
  }

  private getDimension(): string {
    return this.orientation.dimension();
  }

  private doAlign(index: number, options: IAnimOptions, alignPoint: number) {
    let distanceContentsMustMoveBack;
    distanceContentsMustMoveBack = this.widgetStrip.getLengthToIndex(index);
    distanceContentsMustMoveBack -= this.getAlignmentPoint();
    distanceContentsMustMoveBack += this.getWidgetAlignmentPoint(index);
    this.moveContentsTo(-distanceContentsMustMoveBack, options);
    this.currentAlignPoint = alignPoint;
  }

  private resetAlignment() {
    if (this.lastAlignIndex !== null) {
      this.doAlign(this.lastAlignIndex, { skipAnim: true }, this.currentAlignPoint);
    }
  }
}
