import { Device } from '../devices/device';
import { Widget } from './widget';

/**
 * The Label widget displays text. It supports auto-truncation (with ellipsis) of text to fit.
 */
export class Label extends Widget {
  /**
   * Do not truncate the text. Let the browser wrap to as many lines required to display all the text.
   */
  public static TRUNCATION_MODE_NONE: boolean = false;

  /**
   * Truncate text to fit into the number of lines specified by {@link antie.widgets.Label#setMaximumLines}
   * by removing characters at the end of the string and append an ellipsis if text is truncated.
   */
  public static TRUNCATION_MODE_RIGHT_ELLIPSIS: boolean = true;

  private text: string;
  private truncationMode;
  private maxLines: number;
  private enableHTML: boolean;
  private width: number;

  /**
   * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used
   * (but not included in any output).
   * @param text The text content of this label.
   */
  constructor(id?: string, text?: string, enableHTML?: boolean) {
    // The current API states that if only one parameter is passed to
    // use that value as the text and auto generate an internal id
    if (arguments.length === 1) {
      super();
      this.text = id;
    } else {
      super(id);
      this.text = text;
    }
    this.truncationMode = Label.TRUNCATION_MODE_NONE;
    this.maxLines = 0;
    this.enableHTML = enableHTML || false;
    this.width = 0;
    this.addClass('label');
  }

  /**
   * Renders the widget and any child widgets to device-specific output.
   *
   * Returns a device-specific object that represents the widget as displayed
   * on the device (in a browser, a DOMElement);
   * @param device The device to render to.
   */
  public render(device: Device) {
    // TODO: is there a more efficient way of doing this?
    const s = this.getTextAsRendered(device);

    if (!this.outputElement) {
      this.outputElement = device.createLabel(this.id, this.getClasses(), s, this.enableHTML);
    } else {
      device.setElementContent(this.outputElement, s, this.enableHTML);
    }

    return this.outputElement;
  }

  /**
   * Will return text as rendered on the device
   *
   * Returns a string that will be displayed in the label after truncation, etc...
   * @param device The device to render to.
   */
  public getTextAsRendered(device: Device) {
    let s;
    if (this.width && this.maxLines && this.text && this.truncationMode === Label.TRUNCATION_MODE_RIGHT_ELLIPSIS) {
      const h = device.getTextHeight('fW', this.width, this.getClasses());
      const allowedHeight = h * this.maxLines;
      let currentHeight = device.getTextHeight(this.text, this.width, this.getClasses());

      let len = this.text.length;
      while (currentHeight > allowedHeight && len > 1) {
        len = Math.floor(len * allowedHeight / currentHeight);
        currentHeight = device.getTextHeight(this.text.substring(0, len) + '...', this.width, this.getClasses());
      }
      while (currentHeight <= allowedHeight && len <= this.text.length) {
        len++;
        currentHeight = device.getTextHeight(this.text.substring(0, len) + '...', this.width, this.getClasses());
      }
      len--;

      if (len < this.text.length) {
        // truncate at word boundary
        let boundaryLen = len;
        while (boundaryLen && !/\w\W$/.test(this.text.substring(0, boundaryLen + 1))) {
          boundaryLen--;
        }
        s = boundaryLen > 0 ? this.text.substring(0, boundaryLen) + '...' : this.text.substring(0, len) + '...';
      } else {
        s = this.text;
      }
    } else {
      s = this.text;
    }
    return s;
  }

  /**
   * Sets the text displayed by this label.
   * @param text The new text to be displayed.
   */
  public setText(text: string) {
    this.text = text;
    if (this.outputElement) {
      this.render(this.getCurrentApplication().getDevice());
    }
  }

  /**
   * Gets the current text displayed by this label.
   * @returns The current text displayed by this label.
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Sets the truncation mode (currently {@link antie.widgets.Label.TRUNCATION_MODE_NONE} or
   * {@link antie.widgets.Label.TRUNCATION_MODE_RIGHT_ELLIPSIS}).
   *
   * @deprecated TRUNCATION_MODE_RIGHT_ELLIPSIS relies on browserdevice.getTextHeight(), which can be inaccurate.
   * @param mode The new truncation mode.
   */
  public setTruncationMode(mode: boolean) {
    this.truncationMode = mode;
  }

  /**
   * Sets the maximum lines displayed when a truncation mode is set.
   * @param lines The maximum number of lines to display.
   */
  public setMaximumLines(lines: number) {
    this.maxLines = lines;
  }

  /**
   * Sets the width of this label for use with truncation only.
   * @param width The width of this label in pixels
   */
  public setWidth(width: number) {
    this.width = width;
  }
}
