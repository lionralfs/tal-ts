import { BaseClass } from '../../class';
import { DataSource } from '../../datasource';
import { DataBoundEvent } from '../../events/databoundevent';
import { Formatter } from '../../formatter';
import { Iterator } from '../../iterator';
import { Widget } from '../widget';

/**
 * Class for adding children to an existing widget based on a combination
 * of a data source and formatter.
 */
export class Binder extends BaseClass {
  private dataSource: DataSource;
  private formatter: Formatter;

  constructor(formatter: Formatter, dataSource: DataSource) {
    super();
    this.dataSource = dataSource;
    this.formatter = formatter;
  }

  /**
   * Creates new widgets which are then appended to
   * the widget supplied. Continues until the end of the data returned
   * by the source is reached.
   * @param widget The parent of the widgets to be created.
   */
  public appendAllTo(widget: Widget) {
    this.bindAll(widget, this.appendItem);
  }

  private bindAll(widget: Widget, processItemFn, preBindFn?, postBindFn?) {
    const callbacks = this.getCallbacks(widget, processItemFn, postBindFn);
    const beforeBindEvent = new DataBoundEvent('beforedatabind', widget);

    if (typeof preBindFn === 'function') {
      preBindFn(beforeBindEvent);
    }

    widget.bubbleEvent(beforeBindEvent);
    if (!(this.dataSource instanceof Array)) {
      this.dataSource.load(callbacks);
    } else {
      callbacks.onSuccess(this.dataSource);
    }
  }

  private getCallbacks(
    widget: Widget,
    processItemFn: (widget: Widget, boundItem: Widget) => void,
    postBindFn: (evt: DataBoundEvent) => void
  ) {
    return {
      onSuccess: (data: Iterator | any[]) => {
        const it = data instanceof Iterator ? data : new Iterator(data);

        while (it.hasNext()) {
          const boundItem = this.formatter.format(it);
          processItemFn(widget, boundItem);
        }

        const dataBoundEvent = new DataBoundEvent('databound', widget, it);
        if (typeof postBindFn === 'function') {
          postBindFn(dataBoundEvent);
        }

        widget.bubbleEvent(dataBoundEvent);
      },
      onError: (error?: object) => {
        widget.bubbleEvent(new DataBoundEvent('databindingerror', widget, null, error));
      }
    };
  }

  private appendItem(widget, item) {
    return widget.appendChildWidget(item);
  }
}
