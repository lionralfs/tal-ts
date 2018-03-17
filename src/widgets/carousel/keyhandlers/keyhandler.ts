import { BaseClass } from '../../../class';
import { IAnimOptions } from '../../../devices/base/device';
import { Carousel } from '../../carousel';

/**
 * The base KeyHandler class moves alignment of the carousel on LEFT and RIGHT key presses
 * when attached to a Carousel with Horizontal orientation, and moves alignment on UP and
 * DOWN key presses when attached to a Carousel with Vertical orientation.
 */
export abstract class KeyHandler extends BaseClass {
  protected carousel: Carousel;
  private animationOptions: IAnimOptions;

  constructor() {
    super();
    this.animationOptions = {};
  }

  /**
   * Adds listeners to the supplied carousel to provided behaviour when navigation keys are pressed
   * @param carousel
   */
  public attach(carousel: Carousel): void {
    this.carousel = carousel;
    this.addKeyListeners();
    this.addAlignmentListeners();
  }

  /**
   * Sets default animation options for key handled alignments
   * @param options Animation options object
   */
  public setAnimationOptions(options: IAnimOptions): void {
    this.animationOptions = options;
  }

  protected abstract addAlignmentListeners(): void;

  private addKeyListeners(): void {
    const carousel = this.carousel;
    const previousKey = carousel.orientation.defaultKeys().PREVIOUS;
    const nextKey = carousel.orientation.defaultKeys().NEXT;
    carousel.addEventListener('keydown', ev => {
      switch (ev.keyCode) {
        case previousKey:
          if (carousel.previousIndex() !== null) {
            carousel.completeAlignment();
            carousel.alignPrevious(this.animationOptions);
            ev.stopPropagation();
          }
          break;
        case nextKey:
          if (carousel.nextIndex() !== null) {
            carousel.completeAlignment();
            carousel.alignNext(this.animationOptions);
            ev.stopPropagation();
          }
          break;
      }
    });
  }
}
