import { BaseClass } from '../../../class';
import { IAnimOptions } from '../../../devices/base/device';
import { Carousel } from '../../carousel';
/**
 * The base KeyHandler class moves alignment of the carousel on LEFT and RIGHT key presses
 * when attached to a Carousel with Horizontal orientation, and moves alignment on UP and
 * DOWN key presses when attached to a Carousel with Vertical orientation.
 */
export declare abstract class KeyHandler extends BaseClass {
    protected carousel: Carousel;
    private animationOptions;
    constructor();
    /**
     * Adds listeners to the supplied carousel to provided behaviour when navigation keys are pressed
     * @param carousel
     */
    attach(carousel: Carousel): void;
    /**
     * Sets default animation options for key handled alignments
     * @param options Animation options object
     */
    setAnimationOptions(options: IAnimOptions): void;
    protected abstract addAlignmentListeners(): void;
    private addKeyListeners();
}
