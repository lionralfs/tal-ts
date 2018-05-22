import { BaseClass } from '../../../class';
import { KeyEvent } from '../../../events/keyevent';
import { Orientation } from './orientation';

/**
 * Class to encapsulate any data specific to a horizontal orientation
 */
export class HorizontalOrientation extends Orientation {
  public dimension(): string {
    return 'width';
  }

  public edge(): string {
    return 'left';
  }

  public styleClass(): string {
    return 'horizontal';
  }

  public defaultKeys(): { PREVIOUS: number; NEXT: number } {
    return {
      PREVIOUS: KeyEvent.VK_LEFT,
      NEXT: KeyEvent.VK_RIGHT
    };
  }
}

export const Horizontal = new HorizontalOrientation();
