import { Button } from '../widgets/button';
import { BaseEvent } from './event';

/**
 * Class of events raised when focus is gained by a Button.
 */
export class FocusEvent extends BaseEvent {
  public target: Button;

  /**
   * @param target The button which gained focus.
   */
  constructor(target: Button) {
    super('focus');
    this.target = target;
  }
}
