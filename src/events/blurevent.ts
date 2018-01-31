import { Button } from '../widgets/button';
import { BaseEvent } from './event';

/**
 * Class of events raised when focus is removed from a Button.
 */
export class BlurEvent extends BaseEvent {
  public target: Button;

  /**
   * @param target The button which lost focus.
   */
  constructor(target: Button) {
    super('blur');
    this.target = target;
  }
}
