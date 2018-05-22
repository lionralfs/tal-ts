import { Device } from '../devices/base/device';
import { BaseEvent } from '../events/event';
import { KeyEvent } from '../events/keyevent';
import { SelectedItemChangeEvent } from '../events/selecteditemchangeevent';
import { Container } from './container';
import { Widget } from './widget';

/**
 * The Grid widget class represents a grid of widgets that may be navigated between using up/down/left/right.
 */
export class Grid extends Container {
  public static WRAP_MODE = {
    HORIZONTAL: {
      ON: 1,
      OFF: 0
    },
    VERTICAL: {
      ON: 1,
      OFF: 0
    }
  };

  private cols: number;
  private rows: number;
  private horizontalWrapping: boolean;
  private verticalWrapping: boolean;
  private selectedRow: number;
  private selectedCol: number;

  /**
   * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
   * @param cols The number of columns in the grid.
   * @param rows The number of rows in the grid.
   * @param horizontalWrapping Enable or disable horizontal wrapping.
   * @param verticalWrapping Enable or disable vertical wrapping.
   */
  constructor(id: string, cols: number, rows: number, horizontalWrapping: boolean, verticalWrapping: boolean) {
    super(id);

    this.addClass('grid');

    this.cols = cols;
    this.rows = rows;

    this.horizontalWrapping = !!horizontalWrapping;
    this.verticalWrapping = !!verticalWrapping;

    this.selectedRow = 0;
    this.selectedCol = 0;

    for (let i = 0; i < cols * rows; i++) {
      this.childWidgetOrder.push(null);
    }

    this.addEventListener('keydown', e => {
      this.onKeyDown(e);
    });
  }

  /**
   * Get the widget positioned at the specified column and row.
   * @param col The column the widget it in
   * @param row The row the widget it in
   * @return The widget in the specified column and row
   */
  public getWidgetAt(col: number, row: number): Widget {
    return this.childWidgetOrder[this.cols * row + col];
  }

  /**
   * Positions a widget at the specified column and row.
   * @param col The column to position the widget in
   * @param row The row to position the widget in
   * @param widget The widget to add
   */
  public setWidgetAt(col: number, row: number, widget: Widget): void {
    if (!this.hasChildWidget(widget.id)) {
      this.childWidgets[widget.id] = widget;
      this.childWidgetOrder[this.cols * row + col] = widget;
      widget.parentWidget = this;

      // If there's no active child widget set, try and set it to this
      // (Will only have an affect if it's focusable (i.e. contains a button))
      if (!this.activeChildWidget) {
        this.setActiveChildWidget(widget);
      }

      if (this.outputElement && this.autoRenderChildren) {
        const device = this.getCurrentApplication().getDevice();

        if (!widget.outputElement) {
          widget.render(device);
        }

        device.appendChildElement(this.outputElement, widget.outputElement);
      }
    }
  }

  /**
   * Renders the widget and any child widgets to device-specific output.
   * @param device The device to render to.
   * @return A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
   */
  public render(device: Device): HTMLElement {
    if (!this.outputElement) {
      this.outputElement = device.createContainer(this.id, this.getClasses());
    } else {
      device.clearElement(this.outputElement);
    }

    let rowElement: HTMLElement;
    for (let row = 0; row < this.rows; row++) {
      rowElement = device.createContainer(this.id + '_row_' + row, ['row']);
      for (let col = 0; col < this.cols; col++) {
        const widget = this.getWidgetAt(col, row);
        if (widget) {
          if (col === 0) {
            widget.addClass('firstcol');
          } else if (col === this.cols - 1) {
            widget.addClass('lastcol');
          }
          device.appendChildElement(rowElement, this.getWidgetAt(col, row).render(device));
        } else {
          const classes = ['spacer'];
          if (col === 0) {
            classes.push('firstcol');
          } else if (col === this.cols - 1) {
            classes.push('lastcol');
          }
          device.appendChildElement(rowElement, device.createContainer(this.id + '_' + col + '_' + row, classes));
        }
      }
      device.appendChildElement(this.outputElement, rowElement);
    }

    return this.outputElement;
  }

  /**
   * Appends a child widget to this widget. Not supported for Grids - use setWidgetAt() instead.
   * @param widget The child widget to add.
   */
  public appendChildWidget(widget: Widget): Widget {
    throw new Error('appendChildWidget() is not supported for Grids - use setWidgetAt() instead.');
  }

  /**
   * Inserts a child widget at the specified index. Not supported for Grids.
   * @param index The index where to insert the child widget.
   * @param widget The child widget to add.
   */
  public insertChildWidget(index: number, widget: Widget): Widget {
    throw new Error('insertChildWidget() is not supported for Grids.');
  }

  /**
   * Removes a specific child widget from this widget. Not supported for Grids.
   * @param widget The child widget to remove.
   * @param retainElement Pass `true` to retain the child output element of the given widget
   */
  public removeChildWidget(widget: Widget, retainElement?: boolean): void {
    throw new Error('removeChildWidget() is not supported for Grids.');
  }

  /**
   * Attempt to set focus to the given child widget.
   *
   * Note: You can only set focus to a focusable widget. A focusable widget is one that
   * contains an enabled antie.widgets.Button as either a direct or indirect child.
   *
   * Note: Widgets have 2 independant states: active and focussed. A focussed widget is
   * either the Button with focus, or any parent of that Button. An active widget is
   * one which is the active child of its parent Container. When the parent widget
   * receives focus, focus will be placed on the active child.
   *
   * Classes 'active' and 'focus' are appended to widgets with these states.
   *
   * @param widget The child widget to set focus to.
   * @return Boolean true if the child widget was focusable, otherwise boolean false.
   */
  public setActiveChildWidget(widget: Widget): boolean {
    const changed = this.activeChildWidget !== widget;
    if (super.setActiveChildWidget(widget)) {
      const selectedIndex = this.getIndexOfChildWidget(widget);
      this.selectedRow = Math.floor(selectedIndex / this.cols);
      this.selectedCol = Math.floor(selectedIndex % this.cols);

      if (changed) {
        this.bubbleEvent(new SelectedItemChangeEvent(this, widget, selectedIndex));
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * Broadcasts an event from the application level to every single
   * object it contains.
   */
  public broadcastEvent(evt: BaseEvent): void {
    this.fireEvent(evt);
    if (!evt.isPropagationStopped()) {
      for (const childWidget of this.childWidgetOrder) {
        // Grids are the only type of container that may contain
        // null entries in the childWidgetOrder array
        if (childWidget) {
          childWidget.broadcastEvent(evt);
        }
      }
    }
  }

  /**
   * Key handler for grids. Processes KeyEvent.VK_UP, VK_DOWN, VK_LEFT and VK_RIGHT keys and stops propagation
   * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
   * spatial navigation out of the list.
   * @param evt The key event.
   */
  private onKeyDown(evt: KeyEvent): void {
    if (
      evt.keyCode !== KeyEvent.VK_UP &&
      evt.keyCode !== KeyEvent.VK_DOWN &&
      evt.keyCode !== KeyEvent.VK_LEFT &&
      evt.keyCode !== KeyEvent.VK_RIGHT
    ) {
      return;
    }

    let newSelectedCol = this.selectedCol;
    let newSelectedRow = this.selectedRow;
    let newSelectedWidget = null;
    do {
      if (evt.keyCode === KeyEvent.VK_UP) {
        newSelectedRow--;
      } else if (evt.keyCode === KeyEvent.VK_DOWN) {
        newSelectedRow++;
      } else if (evt.keyCode === KeyEvent.VK_LEFT) {
        newSelectedCol--;
      } else if (evt.keyCode === KeyEvent.VK_RIGHT) {
        newSelectedCol++;
      }

      if (newSelectedCol < 0) {
        if (this.horizontalWrapping) {
          newSelectedCol = this.cols - 1;
        } else {
          break;
        }
      }

      if (newSelectedCol >= this.cols) {
        if (this.horizontalWrapping) {
          newSelectedCol = 0;
        } else {
          break;
        }
      }

      if (newSelectedRow < 0) {
        if (this.verticalWrapping) {
          newSelectedRow = this.rows - 1;
        } else {
          break;
        }
      }

      if (newSelectedRow >= this.rows) {
        if (this.verticalWrapping) {
          newSelectedRow = 0;
        } else {
          break;
        }
      }

      const newSelectedIndex = newSelectedRow * this.cols + newSelectedCol;
      const widget = this.childWidgetOrder[newSelectedIndex];
      if (widget && widget.isFocusable()) {
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
