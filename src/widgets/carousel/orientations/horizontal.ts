import { BaseClass } from '../../../class';
import { KeyEvent } from '../../../events/keyevent';
import { Orientation } from './orientation';

/**
 * Class to encapsulate any data specific to a horizontal orientation
 */
export class HorizontalOrientation extends Orientation {
  public dimension() {
    return 'width';
  }

  public edge() {
    return 'left';
  }

  public styleClass() {
    return 'horizontal';
  }

  public defaultKeys() {
    return {
      PREVIOUS: KeyEvent.VK_LEFT,
      NEXT: KeyEvent.VK_RIGHT
    };
  }
}

export const Horizontal = new HorizontalOrientation();
