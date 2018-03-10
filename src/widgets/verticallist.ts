import { DataSource } from '../datasource';
import { KeyEvent } from '../events/keyevent';
import { Formatter } from '../formatter';
import { List } from './list';

/**
 * The VerticalList widget is a container widget that supports spatial navigation between items using `KeyEvent.VK_UP` and `KeyEvent.VK_DOWN`.
 */
export class VerticalList extends List {
  /**
   * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
   * @param itemFormatter A formatter class used on each data item to generate the list item child widgets.
   * @param dataSource An array of data to be used to generate the list items, or an asynchronous data source.
   */
  constructor(id?: string, itemFormatter?: Formatter, dataSource?: DataSource | any[]) {
    super(id, itemFormatter, dataSource);

    this.addClass('verticallist');

    this.addEventListener('keydown', e => {
      this.onKeyDown(e);
    });
  }

  /**
   * Key handler for vertical lists. Processes KeyEvent.VK_UP and KeyEvent.VK_DOWN keys and stops propagation
   * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
   * spatial navigation out of the list.
   * @param evt The key event.
   */
  private onKeyDown(evt: KeyEvent) {
    if (evt.keyCode !== KeyEvent.VK_UP && evt.keyCode !== KeyEvent.VK_DOWN) {
      return;
    }

    let newSelectedIndex = this.selectedIndex;
    let newSelectedWidget = null;
    do {
      if (evt.keyCode === KeyEvent.VK_UP) {
        newSelectedIndex--;
      } else if (evt.keyCode === KeyEvent.VK_DOWN) {
        newSelectedIndex++;
      }
      if (newSelectedIndex < 0 || newSelectedIndex >= this.childWidgetOrder.length) {
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
  }
}
