import { BaseClass } from '../../class';
import { Device, IAnimOptions } from '../../devices/device';
import { Mask } from './mask';
import { Orientation } from './orientations/orientation';

/**
 * Manages communication with device for carousel animations
 */
export class Spinner extends BaseClass {
  private device: Device;
  private mask: Mask;
  private orientation: Orientation;
  private animating: boolean;
  private currentAnimation: object;

  /**
   * @param device The device abstraction object
   * @param mask The carousel mask to be controlled by the spinner
   * @param orientation The orientation object of the carousel
   */
  constructor(device: Device, mask: Mask, orientation: Orientation) {
    super();
    this.device = device;
    this.mask = mask;
    this.orientation = orientation;
    this.animating = false;
    this.currentAnimation = null;
  }

  /**
   * Moves the widget strip's left or top edge relative to the mask's top or left edge
   * by the specified number of pixels via the framework's animation methods.
   * Note that on a browser device the mask will need to have overflow set and the strip will need position: relative
   * for this to work.
   * @param relativePixels The target distance in pixels from the mask's primary edge to the primary edge of it's contents
   * @param animOptions An animation options object
   */
  public moveContentsTo(relativePixels: number, animOptions: IAnimOptions) {
    let moveElementOptions;
    moveElementOptions = this.getOptions(animOptions, relativePixels);
    this.stopAnimation();
    this.animating = true;
    // this.currentAnimation = this.device.moveElementTo(moveElementOptions);
  }

  /**
   * Completes any currently animating alignment, firing any associated callback.
   */
  public stopAnimation() {
    if (this.animating) {
      this.device.stopAnimation(this.currentAnimation);
      this.clearAnimating();
    }
  }

  private getOptions(options, relativePixels) {
    let destination;
    let clonedOptions;

    options = options || {};
    destination = {};
    destination[this.getEdge()] = relativePixels;
    clonedOptions = {};
    // clonedOptions.el = this.mask.getWidgetStrip().outputElement;
    clonedOptions.to = destination;
    clonedOptions.from = options.from;
    clonedOptions.duration = options.duration || 150;
    clonedOptions.easing = options.easing || 'linear';
    clonedOptions.fps = options.fps || '25';
    clonedOptions.skipAnim = options.skipAnim === undefined ? true : options.skipAnim;
    clonedOptions.onComplete = this.getWrappedOnComplete(options);
    return clonedOptions;
  }

  private getWrappedOnComplete(options: IAnimOptions) {
    const wrappedComplete = () => {
      this.clearAnimating();
      if (options.onComplete && typeof options.onComplete === 'function') {
        options.onComplete();
      }
    };
    return wrappedComplete;
  }

  private clearAnimating() {
    this.animating = false;
    this.currentAnimation = null;
  }

  private getEdge() {
    return this.orientation.edge();
  }
}
