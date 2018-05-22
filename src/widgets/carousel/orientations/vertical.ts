import { BaseClass } from '../../../class';
import { KeyEvent } from '../../../events/keyevent';
import { Orientation } from './orientation';

/**
 * Class to encapsulate any data specific to a vertical orientation
 */
export class VerticalOrientation extends Orientation {
  public dimension(): string {
    return 'height';
  }

  public edge(): string {
    return 'top';
  }

  public styleClass(): string {
    return 'vertical';
  }

  public defaultKeys(): { PREVIOUS: number; NEXT: number } {
    return {
      PREVIOUS: KeyEvent.VK_UP,
      NEXT: KeyEvent.VK_DOWN
    };
  }
}

export const Vertical = new VerticalOrientation();
