import { KeyHandler } from './keyhandler';

/**
 * The base ActivateFirstHandler class moves alignment in the same way as the base KeyHandler class
 * Before alignment is started, the active widget is changed to the next focusable widget.
 */
export class ActivateFirstHandler extends KeyHandler {
  protected addAlignmentListeners() {
    const carousel = this.carousel;
    carousel.addEventListener('beforealign', ev => {
      if (ev.target === carousel) {
        carousel.setActiveIndex(ev.alignedIndex);
      }
    });
  }
}
