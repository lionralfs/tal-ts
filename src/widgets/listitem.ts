import { Device } from '../devices/device';
import { Container } from './container';

/**
 * The ListItem widget is a container widget that is used by the `List` widget when set to `List.RENDER_MODE_LIST`.
 * If you wish to control the classNames and id of list items, you can manually create them in your component/formatter and append them to the list.
 * Otherwise, they will be automatically generated and will wrap other widgets you add to any `List` widget when set to `List.RENDER_MODE_LIST`.
 */
export class ListItem extends Container {
  /**
   * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
   */
  constructor(id?: string) {
    super(id);
    this.addClass('listitem');
  }

  /**
   * Renders the widget and any child widgets to device-specific output using the `Device#createListItem` method.
   * @param device The device to render to.
   * @return A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
   */
  public render(device: Device) {
    if (!this.outputElement) {
      this.outputElement = device.createListItem(this.id, this.getClasses());
    }
    return super.render(device);
  }
}
