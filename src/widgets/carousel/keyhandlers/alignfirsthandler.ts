import { KeyHandler } from './keyhandler';

export class AlignFirstHandler extends KeyHandler {
  protected addAlignmentListeners() {
    const carousel = this.carousel;
    carousel.addEventListener('afteralign', ev => {
      if (ev.target === carousel) {
        carousel.setActiveIndex(ev.alignedIndex);
      }
    });
  }
}
