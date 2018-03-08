import { BaseClass } from '../../../class';
import { IAnimOptions } from '../../../devices/device';
import { Mask } from '../mask';
export declare class AlignmentQueue extends BaseClass {
    mask: Mask;
    skip: boolean;
    private queue;
    private started;
    constructor(mask: Mask);
    /**
     * Queues an alignment operation
     * @param index The index of the widget to align on.
     * @param {Object} [options] An animation options object
     * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
     * @param {Number} [options.duration] The duration of the alignment in ms
     * @param {String} [options.easing] The alignment easing function
     * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
     * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
     */
    add(index: number, options: IAnimOptions): void;
    /**
     * Begins executing the alignment operations in the queue. If the
     * queue has already been started, but has not completed, this will
     * do nothing.
     */
    start(): void;
    /**
     * Completes all queued alignments in order, skipping any animation and
     * firing any associated callbacks in sequence.
     */
    complete(): void;
    next(): void;
    private runFirstInQueue();
    private setSkip(skip);
}
