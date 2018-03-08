import { Container } from '../../..';
import { BaseClass } from '../../../class';
export interface IDirections {
    FORWARD: number;
    BACKWARD: number;
}
/**
 * Abstract base Navigator class, used for operations involving widget indices,
 * for example setting the active widget or determining which to set active.
 */
export declare abstract class Navigator extends BaseClass {
    static directions: IDirections;
    protected container: Container;
    constructor(container: Container);
    /**
     * @return the index of the currently active widget, or null if there is no active widget
     * (for example if there are no widgets)
     */
    currentIndex(): number;
    /**
     * @return the index of the next focusable widget
     */
    nextIndex(): number;
    /**
     * @param index
     * @return the first focussable index after that supplied
     */
    indexAfter(index: number): number;
    /**
     * @return the index of the previous focusable widget
     */
    previousIndex(): number;
    /**
     * @param index
     * @return the first focussable index before that supplied
     */
    indexBefore(index: number): number;
    /**
     * @return the number of widgets in the container under control
     */
    indexCount(): number;
    /**
     * Activates the widget at the provided index within the container under control.
     * If a valid (0 <= index < length of container) index, corresponding to a focusable widget is provided and the index
     * is not the currently active index, the widget indexed is activated.
     * If the index corresponds to an unfocussable widget or an invalid index the function has no effect.
     * @param index A 0 base index into the container being navigated
     */
    setIndex(index: number): void;
    /**
     * Sets the container the navigator is managing
     */
    setContainer(container: Container): void;
    protected abstract isValidIndex(index: number): boolean;
    private getActiveIndex();
    private setActiveIndexOnContainer(activeIndex);
    private indexedWidgetCantBeFocussed(index);
    private getIndexIncrementFunction(direction);
    private getNextPotientialIndexInDirection(currentIndex, direction);
    private fireItemChangeEvent(index, EventClass);
}
