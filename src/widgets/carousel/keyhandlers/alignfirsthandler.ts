import { KeyHandler } from './keyhandler';

export class AlignFirstHandler extends KeyHandler {
  protected addAlignmentListeners(): void {
    const carousel = this.carousel;
    carousel.addEventListener('afteralign', ev => {
      if (ev.target === carousel) {
        carousel.setActiveIndex(ev.alignedIndex);
      }
    });
  }
}
