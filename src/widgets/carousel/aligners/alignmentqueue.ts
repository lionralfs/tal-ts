import { BaseClass } from '../../../class';
import { IAnimOptions } from '../../../devices/device';
import { Mask } from '../mask';

function createAlignFunction(self: AlignmentQueue, index: number, options: IAnimOptions) {
  return () => {
    options = options || {};
    const oldComplete = options.onComplete;
    const newOptions = {
      el: options.el,
      to: options.to,
      from: options.from,
      duration: options.duration,
      easing: options.easing,
      skipAnim: options.skipAnim,
      fps: options.fps,
      onComplete: function onComplete() {
        if (oldComplete) {
          oldComplete();
        }
        self.next();
      }
    };

    if (self.skip) {
      newOptions.skipAnim = true;
    }

    self.mask.alignToIndex(index, newOptions);
  };
}

export class AlignmentQueue extends BaseClass {
  public mask: Mask;
  public skip: boolean;
  private queue: Array<() => void>;
  private started: boolean;

  constructor(mask: Mask) {
    super();
    this.mask = mask;
    this.setSkip(false);
    this.queue = [];
    this.started = false;
  }

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
  public add(index: number, options: IAnimOptions) {
    const alignFunction = createAlignFunction(this, index, options);

    this.queue.push(alignFunction);
  }

  /**
   * Begins executing the alignment operations in the queue. If the
   * queue has already been started, but has not completed, this will
   * do nothing.
   */
  public start() {
    if (!this.started) {
      this.runFirstInQueue();
    }
  }

  /**
   * Completes all queued alignments in order, skipping any animation and
   * firing any associated callbacks in sequence.
   */
  public complete() {
    if (this.started) {
      this.setSkip(true);
      this.mask.stopAnimation();
    }
  }

  public next() {
    this.queue.shift();
    this.runFirstInQueue();
  }

  private runFirstInQueue() {
    if (this.queue.length > 0) {
      this.started = true;
      this.queue[0]();
    } else {
      this.setSkip(false);
      this.started = false;
    }
  }

  private setSkip(skip: boolean) {
    this.skip = skip;
  }
}
