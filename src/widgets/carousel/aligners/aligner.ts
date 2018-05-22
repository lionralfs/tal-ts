import { BaseClass } from '../../../class';
import { IAnimOptions } from '../../../devices/base/device';
import { Mask } from '../mask';
import { Navigator } from '../navigators/navigator';
import { AlignmentQueue } from './alignmentqueue';
/**
 * Converts simple index based alignment instructions to combinations of
 * one or more pixel based alignments to be performed on the mask
 */
export class Aligner extends BaseClass {
  public static directions: { [key: string]: number } = { FORWARD: 0, BACKWARD: 1 };
  private mask: Mask;
  private queue: AlignmentQueue;
  private lastAlignIndex: number;

  /**
   * @param mask The carousel's mask object
   */
  constructor(mask: Mask) {
    super();
    this.mask = mask;
    this.queue = new AlignmentQueue(this.mask);
    this.lastAlignIndex = null;
  }

  /**
   * Aligns the mask and widget strip to the next enabled widget after that currently aligned.
   * If no alignment has been performed previously it will align to the next enabled widget after that at index 0
   * If a wrapping strip and navigator are used the alignment will wrap to the start after the last widget is reached.
   * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
   * @param navigator The carousel's current navigator
   * @param options An animation options object
   * @param options.fps The frames per second of the alignment, if using styletopleft animation
   * @param options.duration The duration of the alignment in ms
   * @param options.easing The alignment easing function
   * @param options.skipAnim If set true, the alignment will complete instantly then fire any provided callback
   * @param options.onComplete A function which will be executed on completion of the alignment animation.
   */
  public alignNext(navigator: Navigator, options: IAnimOptions): void {
    this.align(navigator, Aligner.directions.FORWARD, options);
  }

  /**
   * Aligns the mask and widget strip to the next enabled widget before that currently aligned.
   * If no alignment has been performed previously it will align to the next enabled widget before that at index 0
   * If a wrapping strip and navigator are used the alignment will wrap to the end after the first widget is reached.
   * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
   * @param navigator The carousel's current navigator
   * @param options An animation options object
   * @param options.fps The frames per second of the alignment, if using styletopleft animation
   * @param options.duration The duration of the alignment in ms
   * @param options.easing The alignment easing function
   * @param options.skipAnim If set true, the alignment will complete instantly then fire any provided callback
   * @param options.onComplete A function which will be executed on completion of the alignment animation.
   */
  public alignPrevious(navigator: Navigator, options: IAnimOptions): void {
    this.align(navigator, Aligner.directions.BACKWARD, options);
  }

  /**
   * Aligns the mask and widget strip to the widget at the specified index
   * Will always move forward if the index is after that currently aligned and backwards if index is before
   * that currently aligned.
   * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
   * @param index The index of the widget to align on.
   * @param options An animation options object
   * @param options.fps The frames per second of the alignment, if using styletopleft animation
   * @param options.duration The duration of the alignment in ms
   * @param options.easing The alignment easing function
   * @param options.skipAnim If set true, the alignment will complete instantly then fire any provided callback
   * @param options.onComplete A function which will be executed on completion of the alignment animation.
   */
  public alignToIndex(index: number, options: IAnimOptions): void {
    this.informMaskBeforeAlign(index);
    this.moveNormally(index, options);
  }

  /**
   * Get the last index the carousel was asked to align to
   * @return The last index the carousel was asked to align to, or null if no alignments have completed.
   */
  public indexOfLastAlignRequest(): number {
    return this.lastAlignIndex;
  }

  /**
   * Instantly completes any in-flight alignment animations, firing any callbacks that were provided.
   * If several alignments have been queued, all will complete in order.
   */
  public complete(): void {
    this.queue.complete();
  }

  private align(navigator: Navigator, direction: number, options: IAnimOptions): void {
    const startIndex = this.indexOfLastAlignRequest();
    const targetIndex = this.subsequentIndexInDirection(navigator, direction);

    if (targetIndex !== null) {
      this.informMaskBeforeAlign(targetIndex);
      if (this.isWrap(startIndex, targetIndex, direction)) {
        this.wrap(startIndex, targetIndex, navigator, direction, options);
      } else {
        this.moveNormally(targetIndex, options);
      }
    }
  }

  private subsequentIndexInDirection(navigator: Navigator, direction: number): number {
    const lastAligned = this.indexOfLastAlignRequest();
    const startPoint = lastAligned === null ? 0 : lastAligned;
    if (direction === Aligner.directions.FORWARD) {
      return navigator.indexAfter(startPoint);
    } else {
      return navigator.indexBefore(startPoint);
    }
  }

  private isWrap(startIndex: number, targetIndex: number, direction: number): boolean {
    if (direction === Aligner.directions.FORWARD && startIndex > targetIndex) {
      return true;
    }
    if (direction === Aligner.directions.BACKWARD && startIndex < targetIndex) {
      return true;
    }
    return false;
  }

  private informMaskBeforeAlign(index: number): void {
    this.mask.beforeAlignTo(this.lastAlignIndex, index);
    this.lastAlignIndex = index;
  }

  private informMaskAfterAlign(index: number): void {
    this.mask.afterAlignTo(index);
  }

  private wrap(
    fromIndex: number,
    toIndex: number,
    navigator: Navigator,
    direction: number,
    options: IAnimOptions
  ): void {
    if (this.fromIndexActive(fromIndex, navigator)) {
      this.visibleActiveItemWrap(fromIndex, toIndex, navigator, direction, options);
    } else {
      this.invisibleActiveItemWrap(fromIndex, toIndex, navigator, direction, options);
    }
  }

  private fromIndexActive(fromIndex: number, navigator: Navigator): boolean {
    const activeIndex = navigator.currentIndex();
    return fromIndex === activeIndex;
  }

  private invisibleActiveItemWrap(
    fromIndex: number,
    toIndex: number,
    navigator: Navigator,
    direction: number,
    options: IAnimOptions
  ): void {
    const index = this.firstIndexToAlignForInvisibleActiveItemWrap(fromIndex, navigator, direction);
    this.queue.add(index, { skipAnim: true });
    this.queueFinalAlign(toIndex, options);
    this.queue.start();
  }

  private firstIndexToAlignForInvisibleActiveItemWrap(
    fromIndex: number,
    navigator: Navigator,
    direction: number
  ): number {
    const widgetCount = navigator.indexCount();
    if (direction === Aligner.directions.FORWARD) {
      return fromIndex - navigator.indexCount();
    } else {
      return widgetCount + fromIndex;
    }
  }

  private visibleActiveItemWrap(
    fromIndex: number,
    toIndex: number,
    navigator: Navigator,
    direction: number,
    options: IAnimOptions
  ): void {
    const firstAlignIndex = this.firstIndexToAlignForVisibleActiveItemWrap(toIndex, navigator, direction);
    this.queue.add(firstAlignIndex, options);
    this.queueFinalAlign(toIndex, { skipAnim: true });
    this.queue.start();
  }

  private firstIndexToAlignForVisibleActiveItemWrap(toIndex: number, navigator: Navigator, direction: number): number {
    if (direction === Aligner.directions.FORWARD) {
      return navigator.indexCount() + toIndex;
    } else {
      return -navigator.indexCount() + toIndex;
    }
  }

  private moveNormally(toIndex: number, options: IAnimOptions): void {
    this.queueFinalAlign(toIndex, options);
    this.queue.start();
  }

  private queueFinalAlign(toIndex: number, options: IAnimOptions): void {
    function OptionsClone(): void {
      //
    }

    const unwrappedComplete = () => {
      this.informMaskAfterAlign(toIndex);
    };

    const wrappedComplete = () => {
      options.onComplete();
      this.informMaskAfterAlign(toIndex);
    };

    OptionsClone.prototype = options;
    const optionsWithCallback = new OptionsClone();

    optionsWithCallback.onComplete = options && options.onComplete ? wrappedComplete : unwrappedComplete;

    this.queue.add(toIndex, optionsWithCallback);
  }
}
