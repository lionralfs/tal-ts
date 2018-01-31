import { Button } from '../widgets/button';
import { BaseEvent } from './event';
/**
 * Class of events raised when focus is gained by a Button and
 * has not been lost within an application-wide number of milliseconds.
 */
export declare class FocusDelayEvent extends BaseEvent {
    target: Button;
    /**
     * @param {antie.widgets.Button} target The button which gained focus.
     */
    constructor(target: Button);
}
