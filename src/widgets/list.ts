// import { DataSource } from '../datasource';
// import { Device } from '../devices/device';
// import { DataBoundEvent } from '../events/databoundevent';
// import { BaseEvent } from '../events/event';
// import { SelectedItemChangeEvent } from '../events/selecteditemchangeevent';
// import { Formatter } from '../formatter';
// import { Iterator } from '../iterator';
// import { Container } from './container';
// import { ListItem } from './listitem';
// import { Widget } from './widget';

// /**
//  * The List widget contains an ordered list of items which may be populated either by a static
//  * array or by binding to an asynchronous data source.
//  * Note: The List widget has no spatial navigation. See `VerticalList`
//  * and `HorizontalList` for widgets that support spatial navigation.
//  */
// export class List extends Container {
//   /**
//    * Render as a generic container (e.g. <div>), with a generic container for each list item.
//    */
//   public static RENDER_MODE_CONTAINER = 1;

//   /**
//    * Render as a list (e.g. <ul>), with list item elements (e.g. <li>) for each item.
//    */
//   public static RENDER_MODE_LIST = 2;

//   public static DATA_BIND_FORWARD = 0;
//   public static DATA_BIND_REVERSE = 1;

//   private selectedIndex: number;
//   private dataSource: DataSource;
//   private itemFormatter: Formatter;
//   private dataBound: boolean;
//   private totalDataItems: number;
//   private renderMode: number;
//   private dataBindingOrder: number;

//   /**
//    * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
//    * @param itemFormatter A formatter class used on each data item to generate the list item child widgets.
//    * @param dataSource An array of data to be used to generate the list items, or an asynchronous data source.
//    */
//   constructor(id?: string, itemFormatter?: Formatter, dataSource?: DataSource) {
//     super(id);

//     this.selectedIndex = 0;
//     this.dataSource = dataSource;
//     this.itemFormatter = itemFormatter;
//     this.dataBound = false;
//     this.totalDataItems = 0;
//     this.renderMode = List.RENDER_MODE_CONTAINER;
//     this.dataBindingOrder = List.DATA_BIND_FORWARD;

//     this.addClass('list');
//   }

//   /**
//    * Appends a child widget to this widget, creating a new list item.
//    * @param widget The child widget to add.
//    */
//   public appendChildWidget(widget: Widget): Widget {
//     if (this.renderMode === List.RENDER_MODE_LIST && !(widget instanceof ListItem)) {
//       const li = new ListItem();
//       li.appendChildWidget(widget);
//       li.setDataItem(widget.getDataItem());
//       super.appendChildWidget(li);
//       return li;
//     } else {
//       widget.addClass('listitem');
//       super.appendChildWidget(widget);
//       return widget;
//     }
//   }

//   /**
//    * Inserts a child widget at the specified index.
//    * @param index The index where to insert the child widget.
//    * @param widget The child widget to add.
//    */
//   public insertChildWidget(index: number, widget: Widget) {
//     let w;
//     if (this.renderMode === List.RENDER_MODE_LIST && !(widget instanceof ListItem)) {
//       w = new ListItem();
//       w.appendChildWidget(widget);
//       w.setDataItem(widget.getDataItem());
//       super.insertChildWidget(index, w);
//     } else {
//       widget.addClass('listitem');
//       super.insertChildWidget(index, widget);
//       w = widget;
//     }
//     if (index <= this.selectedIndex && this.selectedIndex + 1 < this.getChildWidgetCount()) {
//       this.selectedIndex++;
//     }
//     return widget;
//   }

//   /**
//    * Attempt to set focus to the given child widget.
//    * Note: You can only set focus to a focusable widget. A focusable widget is one that
//    * contains an enabled antie.widgets.Button as either a direct or indirect child.
//    * @param widget The child widget to set focus to.
//    * @return Boolean true if the child widget was focusable, otherwise boolean false.
//    */
//   public setActiveChildWidget(widget: Widget): boolean {
//     const changed = this.activeChildWidget !== widget;
//     if (super.setActiveChildWidget(widget)) {
//       this.selectedIndex = this.getIndexOfChildWidget(widget);
//       if (changed) {
//         this.bubbleEvent(new SelectedItemChangeEvent(this, widget, this.selectedIndex));
//       }
//       return true;
//     } else {
//       return false;
//     }
//   }

//   /**
//    * Renders the widget and any child widgets to device-specific output. If the list is bound
//    * to an asynchronous data source, get the data.
//    * @param device The device to render to.
//    * @return A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
//    */
//   public render(device: Device) {
//     if (!this.dataBound && this.dataSource && this.itemFormatter) {
//       this.createDataBoundItems();
//     }
//     if (!this.outputElement && this.renderMode === List.RENDER_MODE_LIST) {
//       this.outputElement = device.createList(this.id, this.getClasses());
//     }
//     return super.render(device);
//   }

//   /**
//    * Binds the list to a different data source. If the list is already rendered,
//    * the output will be updated to reflect the new data.
//    * @param dataSource The data source to bind to.
//    */
//   public setDataSource(dataSource: DataSource) {
//     // abort currently processing data requests
//     if (this.dataSource && typeof this.dataSource.abort === 'function') {
//       this.dataSource.abort();
//     }
//     this.dataSource = dataSource;
//     if (this.outputElement) {
//       this.createDataBoundItems();
//     }
//   }

//   /**
//    * Invalidates the data-related bindings - causing items to be re-created on next render;
//    */
//   public resetDataBindings() {
//     this.dataBound = false;
//   }

//   /**
//    * Re-iterates the data source, recreating list items.
//    */
//   public rebindDataSource() {
//     this.dataBound = false;
//     this.setDataSource(this.dataSource);
//   }

//   /**
//    * Sets the rendering mode to either <code>List.RENDER_MODE_CONTAINER</code> or <code>List.RENDER_MODE_LIST</code>.
//    * List.RENDER_MODE_CONTAINER causes the list to be rendered as a generic container (e.g. &lt;div&gt;), with a generic container for each
//    * list item. List.RENDER_MODE_LIST causes the list to be rendered as a list (e.g. &lt;ul&gt;), with list item elements (e.g. &lt;li&gt;) for each item.
//    * @param mode The rendering mode to use.
//    */
//   public setRenderMode(mode: number) {
//     this.renderMode = mode;
//   }

//   /**
//    * Unbinds a previously-bound progress indicator widget.
//    */
//   public unbindProgressIndicator() {
//     if (this.updateProgressHandler) {
//       this.removeEventListener('selecteditemchange', this.updateProgressHandler);
//       this.removeEventListener('focus', this.updateProgressHandler);
//       this.removeEventListener('blur', this.updateProgressHandler);
//       this.removeEventListener('databound', this.updateProgressHandler);
//     }
//   }

//   public removeChildWidget(widget: Widget) {
//     // TODO: Make this more generic - it will only work if carousel items contain a
//     // TODO: single item of data.
//     if (this.updateProgressHandler && this.childWidgetOrder.length < this.totalDataItems) {
//       this.getCurrentApplication()
//         .getDevice()
//         .getLogger()
//         .warn(
//           'antie.widgets.List::removeChildWidget - removing' +
//             ' list items where multiple data items are contained within each list item' +
//             ' can cause unintended behaviour within any position indicator attached' +
//             ' to the list.'
//         );
//     }

//     const ignore = this.childWidgetOrder.length - this.totalDataItems;
//     this.totalDataItems--;
//     const retValue = super.removeChildWidget(widget);
//     widget.removeClass('listitem');

//     for (let i = 0; i < this.childWidgetOrder.length; i++) {
//       this.childWidgetOrder[i].listIndex = i - ignore;
//     }
//     return retValue;
//   }

//   public removeChildWidgets() {
//     for (const childWidget of this.childWidgetOrder) {
//       childWidget.removeClass('listitem');
//     }

//     this.totalDataItems = 0;
//     return super.removeChildWidgets();
//   }

//   public setDataBindingOrder(order) {
//     this.dataBindingOrder = order;
//   }

//   public getDataBindingOrder() {
//     return this.dataBindingOrder;
//   }

//   /**
//    * Binds a progress indicator widget to this list.
//    * @param widget The progress indicator widget.
//    * @param formatterCallback A function that takes the current item index and the total number of items and returns
//    * a string to popular the progress indicator's label.
//    */
//   public bindProgressIndicator(
//     widget: HorizontalProgress,
//     formatterCallback?: (currentIndex: number, total: number) => string
//   ) {
//     this.updateProgressHandler = (evt: BaseEvent) => {
//       if (evt.target !== this) {
//         return;
//       }

//       if (evt.type === 'beforedatabind') {
//         widget.setText('');
//         return;
//       }

//       // TODO: This is a bit of a hack - if more data items were iterated over to populate the list
//       // TODO: than there are items in the list, we assume some list items contain more than one
//       // TODO: data item, therefore we have to use their position within the data source, rather than
//       // TODO: their position within the rendered list widget.

//       let ignore: number = this.childWidgetOrder.length - this.totalDataItems;

//       if (ignore < 0) {
//         ignore = 0;
//       }

//       const activeWidget = this.getActiveChildWidget();
//       const index =
//         this.dataBound && activeWidget && activeWidget.listIndex !== undefined
//           ? activeWidget.listIndex
//           : this.selectedIndex - ignore;

//       const total = this.childWidgetOrder.length - ignore;

//       let p: number;
//       if (index < 0) {
//         p = 0;
//       } else {
//         p = index / (total - 1);
//         if (p < 0) {
//           p = 0;
//         }
//       }

//       if (formatterCallback) {
//         const val = formatterCallback(index + 1, total);
//         if (typeof val === 'string') {
//           widget.setText(val);
//         } else {
//           widget.setText(val.text);
//           p = val.pos;
//         }
//       }

//       // if the formatter function has moved the position indicator, we don't change it
//       widget.setValue(p);
//     };
//     this.addEventListener('selecteditemchange', this.updateProgressHandler);
//     this.addEventListener('focus', this.updateProgressHandler);
//     this.addEventListener('blur', this.updateProgressHandler);
//     this.addEventListener('beforedatabind', this.updateProgressHandler);
//     this.addEventListener('databound', this.updateProgressHandler);
//   }

//   private updateProgressHandler(evt: BaseEvent) {
//     //
//   }

//   /**
//    * Create list items from the bound data.
//    */
//   private createDataBoundItems() {
//     this.dataBound = true;

//     const processDataCallback = (data: Iterator | any[]) => {
//       this.removeChildWidgets();

//       const iterator = data instanceof Iterator ? data : new Iterator(data);
//       while (iterator.hasNext()) {
//         const i = iterator.currentIndex;

//         const w = this.itemFormatter.format(iterator);
//         w.listIndex = i;
//         if (this.dataBindingOrder === List.DATA_BIND_FORWARD) {
//           this.appendChildWidget(w);
//         } else if (this.dataBindingOrder === List.DATA_BIND_REVERSE) {
//           this.insertChildWidget(0, w);
//         }
//       }
//       this.totalDataItems = iterator.currentIndex;

//       this.bubbleEvent(new DataBoundEvent('databound', this, iterator));
//     };

//     const processDataError = (response: object) => {
//       this.removeChildWidgets();
//       this.bubbleEvent(new DataBoundEvent('databindingerror', self, null, response));
//     };

//     this.bubbleEvent(new DataBoundEvent('beforedatabind', self));

//     if (!this.dataSource || this.dataSource instanceof Array) {
//       processDataCallback(this.dataSource);
//     } else {
//       this.dataSource.load({
//         onSuccess: processDataCallback,
//         onError: processDataError
//       });
//     }
//   }
// }
