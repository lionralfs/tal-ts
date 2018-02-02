import { BaseClass } from '../../class';
import { Device, IAnimOptions } from '../../devices/device';
import { Mask } from './mask';
import { Orientation } from './orientations/orientation';
/**
 * Manages communication with device for carousel animations
 */
export declare class Spinner extends BaseClass {
    private device;
    private mask;
    private orientation;
    private animating;
    private currentAnimation;
    /**
     * @param device The device abstraction object
     * @param mask The carousel mask to be controlled by the spinner
     * @param orientation The orientation object of the carousel
     */
    constructor(device: Device, mask: Mask, orientation: Orientation);
    /**
     * Moves the widget strip's left or top edge relative to the mask's top or left edge
     * by the specified number of pixels via the framework's animation methods.
     * Note that on a browser device the mask will need to have overflow set and the strip will need position: relative
     * for this to work.
     * @param relativePixels The target distance in pixels from the mask's primary edge to the primary edge of it's contents
     * @param animOptions An animation options object
     */
    moveContentsTo(relativePixels: number, animOptions: IAnimOptions): void;
    /**
     * Completes any currently animating alignment, firing any associated callback.
     */
    stopAnimation(): void;
    private getOptions(options, relativePixels);
    private getWrappedOnComplete(options);
    private clearAnimating();
    private getEdge();
}
