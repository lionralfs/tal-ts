import { BaseClass } from '../../../class';
import { IAnimOptions } from '../../../devices/device';
import { Mask } from '../mask';
import { Navigator } from '../navigators/navigator';
/**
 * Converts simple index based alignment instructions to combinations of
 * one or more pixel based alignments to be performed on the mask
 */
export declare class Aligner extends BaseClass {
    static directions: {
        [key: string]: number;
    };
    private mask;
    private queue;
    private lastAlignIndex;
    /**
     * @param mask The carousel's mask object
     */
    constructor(mask: Mask);
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
    alignNext(navigator: Navigator, options: IAnimOptions): void;
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
    alignPrevious(navigator: Navigator, options: IAnimOptions): void;
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
    alignToIndex(index: number, options: IAnimOptions): void;
    /**
     * Get the last index the carousel was asked to align to
     * @return The last index the carousel was asked to align to, or null if no alignments have completed.
     */
    indexOfLastAlignRequest(): number;
    /**
     * Instantly completes any in-flight alignment animations, firing any callbacks that were provided.
     * If several alignments have been queued, all will complete in order.
     */
    complete(): void;
    private align(navigator, direction, options);
    private subsequentIndexInDirection(navigator, direction);
    private isWrap(startIndex, targetIndex, direction);
    private informMaskBeforeAlign(index);
    private informMaskAfterAlign(index);
    private wrap(fromIndex, toIndex, navigator, direction, options);
    private fromIndexActive(fromIndex, navigator);
    private invisibleActiveItemWrap(fromIndex, toIndex, navigator, direction, options);
    private firstIndexToAlignForInvisibleActiveItemWrap(fromIndex, navigator, direction);
    private visibleActiveItemWrap(fromIndex, toIndex, navigator, direction, options);
    private firstIndexToAlignForVisibleActiveItemWrap(toIndex, navigator, direction);
    private moveNormally(toIndex, options);
    private queueFinalAlign(toIndex, options);
}
