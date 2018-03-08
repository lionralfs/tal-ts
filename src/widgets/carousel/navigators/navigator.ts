import { Container } from '../../..';
import { BaseClass } from '../../../class';
import { BeforeSelectedItemChangeEvent } from '../../../events/beforeselecteditemchangeevent';
import { BaseEvent } from '../../../events/event';
import { SelectedItemChangeEvent } from '../../../events/selecteditemchangeevent';
import { Widget } from '../../widget';

export interface IDirections {
  FORWARD: number;
  BACKWARD: number;
}

/**
 * Abstract base Navigator class, used for operations involving widget indices,
 * for example setting the active widget or determining which to set active.
 */
export abstract class Navigator extends BaseClass {
  public static directions: IDirections = {
    FORWARD: 0,
    BACKWARD: 1
  };

  protected container: Container;

  constructor(container: Container) {
    super();
    this.setContainer(container);
  }

  /**
   * @return the index of the currently active widget, or null if there is no active widget
   * (for example if there are no widgets)
   */
  public currentIndex(): number {
    return this.getActiveIndex();
  }

  /**
   * @return the index of the next focusable widget
   */
  public nextIndex(): number {
    const currentIndex = this.currentIndex();
    return this.indexAfter(currentIndex);
  }

  /**
   * @param index
   * @return the first focussable index after that supplied
   */
  public indexAfter(index: number): number {
    return this.getNextPotientialIndexInDirection(index, Navigator.directions.FORWARD);
  }

  /**
   * @return the index of the previous focusable widget
   */
  public previousIndex(): number {
    const currentIndex = this.currentIndex();
    return this.indexBefore(currentIndex);
  }

  /**
   * @param index
   * @return the first focussable index before that supplied
   */
  public indexBefore(index: number): number {
    return this.getNextPotientialIndexInDirection(index, Navigator.directions.BACKWARD);
  }

  /**
   * @return the number of widgets in the container under control
   */
  public indexCount(): number {
    return this.container.getChildWidgetCount();
  }

  /**
   * Activates the widget at the provided index within the container under control.
   * If a valid (0 <= index < length of container) index, corresponding to a focusable widget is provided and the index
   * is not the currently active index, the widget indexed is activated.
   * If the index corresponds to an unfocussable widget or an invalid index the function has no effect.
   * @param index A 0 base index into the container being navigated
   */
  public setIndex(index: number) {
    if (this.isValidIndex(index) && !this.indexedWidgetCantBeFocussed(index)) {
      this.fireItemChangeEvent(index, BeforeSelectedItemChangeEvent);
      this.setActiveIndexOnContainer(index);
      this.fireItemChangeEvent(index, SelectedItemChangeEvent);
    }
  }

  /**
   * Sets the container the navigator is managing
   */
  public setContainer(container: Container) {
    this.container = container;
  }

  protected abstract isValidIndex(index: number): boolean;

  private getActiveIndex() {
    const activeWidget = this.container.getActiveChildWidget();
    const activeIndex = this.container.getIndexOfChildWidget(activeWidget);
    if (activeIndex !== -1) {
      return activeIndex;
    } else {
      return null;
    }
  }

  private setActiveIndexOnContainer(activeIndex: number) {
    if (activeIndex !== this.currentIndex()) {
      this.container.setActiveChildIndex(activeIndex);
    }
  }

  private indexedWidgetCantBeFocussed(index: number) {
    const widgets = this.container.getChildWidgets();
    const focussable = widgets[index].isFocusable();
    return !focussable;
  }

  private getIndexIncrementFunction(direction: number) {
    let nextFn: (index: number) => number;
    function forwardFn(index: number) {
      return index + 1;
    }
    function backFn(index: number) {
      return index - 1;
    }

    switch (direction) {
      case Navigator.directions.FORWARD:
        nextFn = forwardFn;
        break;
      case Navigator.directions.BACKWARD:
        nextFn = backFn;
        break;
    }
    return nextFn;
  }

  private getNextPotientialIndexInDirection(currentIndex: number, direction: number): number {
    const incrementIndex = this.getIndexIncrementFunction(direction);

    let potentialActiveIndex = incrementIndex(currentIndex);
    let indexIsValid = this.isValidIndex(potentialActiveIndex);

    while (indexIsValid && this.indexedWidgetCantBeFocussed(potentialActiveIndex)) {
      potentialActiveIndex = incrementIndex(potentialActiveIndex);
      indexIsValid = this.isValidIndex(potentialActiveIndex);
    }

    return potentialActiveIndex;
  }

  private fireItemChangeEvent(
    index: number,
    EventClass: new (target: Widget, item: Widget, index: number) => BaseEvent
  ) {
    const target = this.container;
    const item = this.container.getChildWidgets()[index];
    const event = new EventClass(target, item, index);
    target.bubbleEvent(event);
  }
}
