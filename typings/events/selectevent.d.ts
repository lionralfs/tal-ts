import { Button } from '../widgets/button';
import { BaseEvent } from './event';
/**
 * Class of events raised when a Button has been selected/activated/clicked by a user.
 */
export declare class SelectEvent extends BaseEvent {
    target: Button;
    /**
     * @param target The button which has been selected/activated/clicked by the user;
     */
    constructor(target: Button);
}
