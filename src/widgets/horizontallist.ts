import { DataSource } from '../datasource';
import { KeyEvent } from '../events/keyevent';
import { Formatter } from '../formatter';
import { List } from './list';

/**
 * The HorizontalList widget is a container widget that supports spatial navigation between items using `KeyEvent.VK_LEFT` and `KeyEvent.VK_RIGHT`.
 */
export class HorizontalList extends List {
  public static WRAP_MODE_NONE = 0;
  public static WRAP_MODE_WRAP = 1;

  private maskElement: Error;
  private wrapMode: number;

  /**
   * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
   * @param {antie.Formatter} [itemFormatter] A formatter class used on each data item to generate the list item child widgets.
   * @param {antie.DataSource|Array} [dataSource] An array of data to be used to generate the list items, or an aysnchronous data source.
   */
  constructor(id?: string, itemFormatter?: Formatter, dataSource?: DataSource | any[]) {
    super(id, itemFormatter, dataSource);
    // we need to wrap our contents in a mask to support animation
    this.maskElement = null;

    this.addClass('horizontallist');

    this.addEventListener('keydown', e => {
      this.onKeyDown(e);
    });
  }

  /**
   * Set whether to support wrapping within the list.
   * @param wrapMode Pass `HorizontalList.WRAP_MODE_NONE` for no wrapping.
   * Pass `HorizontalList.WRAP_MODE_NONE` to allow navigation to wrap.
   */
  public setWrapMode(wrapMode: number) {
    this.wrapMode = wrapMode;
  }

  /**
   * Key handler for horizontal lists. Processes KeyEvent.VK_LEFT and KeyEvent.VK_RIGHT keys and stops propagation
   * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
   * spatial navigation out of the list.
   * @param evt The key event.
   */
  private onKeyDown(evt: KeyEvent) {
    if (evt.keyCode !== KeyEvent.VK_LEFT && evt.keyCode !== KeyEvent.VK_RIGHT) {
      return;
    }

    let newSelectedIndex = this.selectedIndex;
    let newSelectedWidget = null;
    do {
      if (evt.keyCode === KeyEvent.VK_LEFT) {
        newSelectedIndex--;
      } else if (evt.keyCode === KeyEvent.VK_RIGHT) {
        newSelectedIndex++;
      }

      // force the index to wrap correctly
      if (this.wrapMode === HorizontalList.WRAP_MODE_WRAP) {
        newSelectedIndex = (newSelectedIndex + this.childWidgetOrder.length) % this.childWidgetOrder.length;
      } else if (newSelectedIndex < 0 || newSelectedIndex >= this.childWidgetOrder.length) {
        break;
      }

      const widget = this.childWidgetOrder[newSelectedIndex];
      if (widget.isFocusable()) {
        newSelectedWidget = widget;
        break;
      }
    } while (true);

    if (newSelectedWidget) {
      this.setActiveChildWidget(newSelectedWidget);
      evt.stopPropagation();
    }

    return newSelectedWidget !== null;
  }
}
