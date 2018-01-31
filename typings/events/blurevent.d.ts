import { Button } from '../widgets/button';
import { BaseEvent } from './event';
/**
 * Class of events raised when focus is removed from a Button.
 */
export declare class BlurEvent extends BaseEvent {
    target: Button;
    /**
     * @param target The button which lost focus.
     */
    constructor(target: Button);
}
