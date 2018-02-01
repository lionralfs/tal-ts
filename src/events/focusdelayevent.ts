import { Button } from '../widgets/button';
import { BaseEvent } from './event';

/**
 * Class of events raised when focus is gained by a Button and
 * has not been lost within an application-wide number of milliseconds.
 */
export class FocusDelayEvent extends BaseEvent {
  public target: Button;

  /**
   * @param target The button which gained focus.
   */
  constructor(target: Button) {
    super('focusdelay');
    this.target = target;
  }
}
