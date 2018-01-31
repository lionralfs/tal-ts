import { Device } from '../devices/device';
import { FocusDelayEvent } from '../events/focusdelayevent';
import { KeyEvent } from '../events/keyevent';
import { SelectEvent } from '../events/selectevent';
import { Container } from './container';

/**
 * The Button widget class represents a container widget which can receive focus and be selected/activated by the user.
 */
export class Button extends Container {
  private focusDelayHandle: number;
  private focusDelayTimeout: number;
  private disabled: boolean;

  /**
   * Creates a new button instance
   * @extends antie.widgets.Container
   * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
   * @param animationEnabled If true, a focus delay will be set before displaying the button
   */
  constructor(id?: string, animationEnabled?: boolean) {
    // TODO refactor this to set focusDelay explicitly rather than using animationEnabled with fixed focusDelay
    super(id);

    this.addClass('button');
    this.addClass('buttonBlurred');

    this.focusDelayHandle = null;
    this.disabled = false;

    /* Reduce the focusDelayTimeout for devices that don't have animation enabled */
    this.focusDelayTimeout = typeof animationEnabled === 'boolean' && !animationEnabled ? 500 : 1500;

    /* if the ENTER key is pressed, translate into into a SelectEvent on this button */
    this.addEventListener('keydown', e => {
      if (e.keyCode === KeyEvent.VK_ENTER) {
        this.select();
        e.stopPropagation();
      }
    });
  }

  /**
   * Renders the widget and any child widgets to device-specific output.
   *
   * Returns a device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
   * @param device The device to render to.
   */
  public render(device: Device): HTMLElement {
    this.outputElement = device.createButton(this.id, this.getClasses());
    for (const childWidget of this.childWidgetOrder) {
      device.appendChildElement(this.outputElement, childWidget.render(device));
    }
    return this.outputElement;
  }

  /**
   * Checks to see if a widget is focusable.
   * Returns `true` if the button is enabled.
   */
  public isFocusable(): boolean {
    // a widget can receive focus if it or any of it's descendants are Buttons
    // We're a button, so we are
    return !this.disabled;
  }

  /**
   * Set the button to be disabled and therefore not focusable. Adds `buttonDisabled` class.
   * @param disabled `true` if the button is to be disabled.
   */
  public setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    if (disabled) {
      this.addClass('buttonDisabled');
    } else {
      this.removeClass('buttonDisabled');
    }
  }

  /**
   * Gives this button focus by setting active children back up the widget tree.
   * @param force Pass `true` to force focus to a disabled button.
   * Returns `true` if focus has been moved to the button. Otherwise returns `false`.
   */
  public focus(force?: boolean): boolean {
    const origDisabled = this.disabled;
    if (force) {
      this.disabled = false;
    }

    let focusChanged = true;
    // tslint:disable-next-line
    let w: Button | Container = this;
    while (w.parentWidget) {
      if (!w.parentWidget.setActiveChildWidget(w)) {
        focusChanged = false;
      }
      w = w.parentWidget;
    }

    this.disabled = origDisabled;

    return focusChanged;
  }

  public select() {
    this.bubbleEvent(new SelectEvent(this));
  }

  public removeFocus() {
    super.removeFocus();
    this.removeClass('buttonFocussed');
    this.addClass('buttonBlurred');
  }

  /**
   * Flags the active child as focussed or blurred.
   * @param focus True if the active child is to be focussed, False if the active child is to be blurred.
   */
  public setActiveChildFocussed(focus): void {
    if (this.focusDelayHandle) {
      clearTimeout(this.focusDelayHandle);
    }
    if (focus) {
      this.removeClass('buttonBlurred');
      this.addClass('buttonFocussed');

      // Fire a focus delay event if this button has had focus for more than x-seconds.
      this.focusDelayHandle = setTimeout(() => {
        this.bubbleEvent(new FocusDelayEvent(this));
      }, this.focusDelayTimeout);

      this.getCurrentApplication().setFocussedWidget(this);
    } else {
      this.removeClass('buttonFocussed');
      this.addClass('buttonBlurred');
    }
  }
}
