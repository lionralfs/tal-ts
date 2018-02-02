import { BaseClass } from '../../../class';
import { KeyEvent } from '../../../events/keyevent';
import { Orientation } from './orientation';

/**
 * Class to encapsulate any data specific to a vertical orientation
 */
export class VerticalOrientation extends Orientation {
  public dimension() {
    return 'height';
  }

  public edge() {
    return 'top';
  }

  public styleClass() {
    return 'vertical';
  }

  public defaultKeys() {
    return {
      PREVIOUS: KeyEvent.VK_UP,
      NEXT: KeyEvent.VK_DOWN
    };
  }
}

export const Vertical = new VerticalOrientation();
