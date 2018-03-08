import { Container } from '../../..';
import { Widget } from '../../widget';
import { Orientation } from '../orientations/orientation';

/**
 * A container for the widgets displayed within a carousel
 */
export class WidgetStrip extends Container {
  private orientation: Orientation;
  private lengths: number[];

  /**
   *
   * @param id The unique ID of the widget.
   * @param orientation an object representing the strip's orientation.
   */
  constructor(id: string, orientation: Orientation) {
    super();
    this.addClass(orientation.styleClass());
    this.orientation = orientation;
    this.lengths = [];
    this.addClass('carouselwidgetstrip');
  }

  /**
   * Adds a widget to the end of the strip
   * @param widget The widget to append to the strip
   * @param length the length of the widget in pixels, measured along the primary axis.
   * (Height for a vertical strip or width for horizontal.) If provided, this value will be used in
   * positioning calculations rather then a calculated value (can be useful when widgets change size)
   * Note length only currently working with non-wrapping strips.
   */
  public append(widget: Widget, length?: number) {
    this.lengths.push(length);
    return this.appendChildWidget(widget);
  }

  /**
   * Inserts widget within the strip
   * @param index A zero based index to begin insertion at, i.e. 0 prepends.
   * @param widget The widget to append to the strip
   * @param length the length of the widget in pixels, measured along the primary axis.
   * (Height for a vertical strip or width for horizontal.) If provided, this value will be used in
   * positioning calculations rather then a calculated value (can be useful when widgets change size)
   * Note length only currently working with non-wrapping strips.
   */
  public insert(index: number, widget: Widget, length?: number) {
    this.lengths.splice(index, 0, length);
    return this.insertChildWidget(index, widget);
  }

  /**
   * Removes a widget from the strip
   * @param widget Widget to remove from the strip
   * @param retainElement Whether to keep the widget's output element in the DOM after removing widget
   */
  public remove(widget: Widget, retainElement = false) {
    const widgets = this.widgets();
    for (let i = 0; i !== widgets.length; i += 1) {
      if (widgets[i] === widget) {
        this.lengths.splice(i, 1);
      }
    }
    return this.removeChildWidget(widget, retainElement);
  }

  /**
   * Removes all widgets from the strip
   */
  public removeAll() {
    this.lengths = [];
    return this.removeChildWidgets();
  }

  /**
   * Get all the widgets in the strip.
   * @return The widgets currently in the strip
   */
  public widgets(): Widget[] {
    return this.getChildWidgets();
  }

  /**
   * Get the distance in pixels to a widget at the supplied index
   * @param index An index of a widget currently in the carousel
   * @return length in pixels along primary axis to primary edge of the provided index
   * i.e. from the left edge of the strip to the left edge of the widget in a horizontal carousel
   */
  public getLengthToIndex(index: number): number {
    const suppliedLength = this.lengthToIndexUsingSuppliedValues(index);
    return suppliedLength !== null ? suppliedLength : this.lengthToIndexByCalculatingUsingElements(index);
  }

  /**
   * Manually sets lengths of elements for movement calculations - useful for elements which change size while moving.
   * @param lengths If provided with a number all lengths will be set equal to this number
   * If provided with an array, the lengths will be set with the corresponding widgets (so the first number will be used
   * for the first widget's length, etc..)
   */
  public setLengths(lengths: number | number[]) {
    if (typeof lengths === 'number') {
      const widgetCount = this.getChildWidgetCount();
      for (let i = 0; i !== widgetCount; i += 1) {
        this.lengths[i] = lengths;
      }
    } else {
      this.lengths = lengths;
    }
  }

  /**
   * Indicates whether the strip needs visible indices attaching before it is aligned
   * @return true if visible indices required, false if not.
   */
  public needsVisibleIndices(): boolean {
    return false;
  }

  /**
   * Strip should ensure all widgets indexed in the array are attached to the parent
   * @param indexArray
   */
  public attachIndexedWidgets(indexArray: number[]) {
    //
  }

  /**
   * Gets the length in pixels of the widget at the supplied index.
   * @param index The index of a widget currently appended to the carousel. Supplied index must be valid (i.e. correspond to a wiget currently in the strip)
   * @return the length in pixels of the widget at the supplied index. Returns the length supplied at append or via setWidgetLength, if neither are specified attempts to calculate and return the length.
   */
  public lengthOfWidgetAtIndex(index: number): number {
    if (this.lengths[index] !== undefined) {
      return this.lengths[index];
    }
    const widget = this.getChildWidgets()[index];
    return this.getWidgetLength(widget);
  }

  /**
   * Manually performs any processing required to put the carousel in a valid state after an append/insert
   */
  public recalculate() {
    //
  }

  /**
   * Toggles autocalculation - Calculation in this context is any strip defined processing required after an append/insert to put the carousel in a valid state.
   * @param on Turns autocalculation on (when true) or off (when false)
   * Calculation is any strip defined processing required after an append/insert to put the carousel in a valid state
   * Autocalculation is on by default when a carousel is created.
   */
  public autoCalculate(on: boolean) {
    //
  }

  private lengthToIndexByCalculatingUsingElements(index: number) {
    const elements: HTMLElement[] = [];
    const widgets = this.getChildWidgets();
    const endIndex = this.getValidatedIndex(widgets, index + 1);
    for (let i = 0; i !== endIndex; i += 1) {
      elements.push(widgets[i].outputElement);
    }
    return this.getOffsetToLastElementInArray(elements);
  }

  private lengthToIndexUsingSuppliedValues(index: number): number {
    let missingLengths: boolean;
    let length = 0;
    for (let i = 0; i !== Math.max(0, index); i += 1) {
      if (this.lengths[i] === undefined) {
        missingLengths = true;
        break;
      } else {
        length += this.lengths[i];
      }
    }
    if (missingLengths) {
      return null;
    } else {
      return length;
    }
  }

  private getValidatedIndex(array: Widget[], index: number): number {
    let endIndex = index;
    if (index < 0) {
      endIndex = 0;
    }
    if (index > array.length) {
      endIndex = array.length;
    }
    return endIndex;
  }

  private getOffsetToLastElementInArray(elementArray: HTMLElement[]) {
    let length = 0;
    const lastIndex = elementArray.length - 1;
    if (lastIndex >= 0) {
      length = this.getElementOffset(elementArray[elementArray.length - 1]);
    }
    return length;
  }

  private getElementOffset(element: HTMLElement) {
    const device = this.getDevice();
    return device.getElementOffset(element)[this.getEdge()];
  }

  private getDevice() {
    return this.getCurrentApplication().getDevice();
  }

  private getDimension() {
    return this.orientation.dimension();
  }

  private getEdge() {
    return this.orientation.edge();
  }

  private getWidgetLength(widget: Widget) {
    return this.getElementLength(widget.outputElement);
  }

  private getElementLength(element: HTMLElement) {
    const device = this.getDevice();
    return device.getElementSize(element)[this.getDimension()];
  }
}

// define('antie/widgets/carousel/strips/widgetstrip', ['antie/widgets/container'], function(Container) {
//   'use strict';
//   /**
//    * A container for the widgets displayed within a carousel
//    * @name antie.widgets.carousel.strips.WidgetStrip
//    * @class
//    * @extends antie.widgets.Container
//    * @param {String} id The unique ID of the widget.
//    * @param {Object} orientation an object representing the strip's orientation.
//    * One of antie.widgets.carousel.orientations.Horizontal or antie.widgets.carousel.orientations.Vertical
//    */
//   var WidgetStrip = Container.extend(
//     /** @lends antie.widgets.carousel.strips.WidgetStrip.prototype */ {
//       /**
//        * @constructor
//        * @ignore
//        */
//       init: function init(id, orientation) {
//         init.base.call(this, id);
//         this.addClass(orientation.styleClass());
//         this._orientation = orientation;
//         this._lengths = [];
//         this.addClass('carouselwidgetstrip');
//       },

//       /**
//        * Adds a widget to the end of the strip
//        * @param {antie.widgets.Widget} widget The widget to append to the strip
//        * @param {Number} [length] the length of the widget in pixels, measured along the primary axis.
//        * (Height for a vertical strip or width for horizontal.) If provided, this value will be used in
//        * positioning calculations rather then a calculated value (can be useful when widgets change size)
//        * Note length only currently working with non-wrapping strips.
//        */
//       append: function append(widget, length) {
//         this._lengths.push(length);
//         return this.appendChildWidget(widget);
//       },

//       /**
//        * Inserts widget within the strip
//        * @param {Number} index A zero based index to begin insertion at, i.e. 0 prepends.
//        * @param {antie.widgets.Widget} widget The widget to append to the strip
//        * @param {Number} [length] the length of the widget in pixels, measured along the primary axis.
//        * (Height for a vertical strip or width for horizontal.) If provided, this value will be used in
//        * positioning calculations rather then a calculated value (can be useful when widgets change size)
//        * Note length only currently working with non-wrapping strips.
//        */
//       insert: function insert(index, widget, length) {
//         this._lengths.splice(index, 0, length);
//         return this.insertChildWidget(index, widget);
//       },

//       /**
//        * Removes a widget from the strip
//        * @param {antie.widgets.Widget} widget Widget to remove from the strip
//        * @param {Boolean} [retainElement=false] Whether to keep the widget's output element in the DOM after removing widget
//        */
//       remove: function remove(widget, retainElement) {
//         var i, widgets;
//         widgets = this.widgets();
//         for (i = 0; i !== widgets.length; i += 1) {
//           if (widgets[i] === widget) {
//             this._lengths.splice(i, 1);
//           }
//         }
//         return this.removeChildWidget(widget, retainElement);
//       },

//       /**
//        * Removes all widgets from the strip
//        */
//       removeAll: function removeAll() {
//         this._lengths = [];
//         return this.removeChildWidgets();
//       },

//       /**
//        * Get all the widgets in the strip.
//        * @returns {Array} The widgets currently in the strip
//        */
//       widgets: function widgets() {
//         return this.getChildWidgets();
//       },

//       /**
//        * Get the distance in pixels to a widget at the supplied index
//        * @param {Number} index An index of a widget currently in the carousel
//        * @returns {Number} length in pixels along primary axis to primary edge of the provided index
//        * i.e. from the left edge of the strip to the left edge of the widget in a horizontal carousel
//        */
//       getLengthToIndex: function getLengthToIndex(index) {
//         var suppliedLength;

//         suppliedLength = this._lengthToIndexUsingSuppliedValues(index);
//         if (suppliedLength !== null) {
//           return suppliedLength;
//         } else {
//           return this._lengthToIndexByCalculatingUsingElements(index);
//         }
//       },

//       /**
//        * Manually sets lengths of elements for movement calculations - useful for elements which change size while moving.
//        * @param lengths {Number} | {Array} If provided with a number all lengths will be set equal to this number
//        * If provided with an array, the lengths will be set with the corresponding widgets (so the first number will be used
//        * for the first widget's length, etc..)
//        */
//       setLengths: function setLengths(lengths) {
//         var widgetCount, i;
//         if (typeof lengths === 'number') {
//           widgetCount = this.getChildWidgetCount();
//           for (i = 0; i !== widgetCount; i += 1) {
//             this._lengths[i] = lengths;
//           }
//         } else {
//           this._lengths = lengths;
//         }
//       },

//       /**
//        * Indicates whether the strip needs visible indices attaching before it is aligned
//        * @returns {Boolean} true if visible indices required, false if not.
//        */
//       needsVisibleIndices: function needsVisibleIndices() {
//         return false;
//       },

//       /**
//        * Strip should ensure all widgets indexed in the array are attached to the parent
//        * @param {Array} indexArray
//        */
//       attachIndexedWidgets: function attachIndexedWidgets(/*indexArray*/) {},

//       _lengthToIndexByCalculatingUsingElements: function _lengthToIndexByCalculatingUsingElements(index) {
//         var elements, widgets, endIndex, i;
//         elements = [];
//         widgets = this.getChildWidgets();
//         endIndex = this._getValidatedIndex(widgets, index + 1);
//         for (i = 0; i !== endIndex; i += 1) {
//           elements.push(widgets[i].outputElement);
//         }
//         return this._getOffsetToLastElementInArray(elements);
//       },

//       _lengthToIndexUsingSuppliedValues: function _lengthToIndexUsingSuppliedValues(index) {
//         var length, missingLengths, i;
//         length = 0;
//         for (i = 0; i !== Math.max(0, index); i += 1) {
//           if (this._lengths[i] === undefined) {
//             missingLengths = true;
//             break;
//           } else {
//             length += this._lengths[i];
//           }
//         }
//         if (missingLengths) {
//           return null;
//         } else {
//           return length;
//         }
//       },

//       /**
//        * Gets the length in pixels of the widget at the supplied index.
//        * @param {Number} index The index of a widget currently appended to the carousel. Supplied index must be valid (i.e. correspond to a wiget currently in the strip)
//        * @returns {Number} the length in pixels of the widget at the supplied index. Returns the length supplied at append or via setWidgetLength, if neither are specified attempts to calculate and return the length.
//        */
//       lengthOfWidgetAtIndex: function lengthOfWidgetAtIndex(index) {
//         var widget;
//         if (this._lengths[index] !== undefined) {
//           return this._lengths[index];
//         }
//         widget = this.getChildWidgets()[index];
//         return this._getWidgetLength(widget);
//       },

//       /**
//        * Manually performs any processing required to put the carousel in a valid state after an append/insert
//        */
//       recalculate: function recalculate() {},

//       /**
//        * Toggles autocalculation - Calculation in this context is any strip defined processing required after an append/insert to put the carousel in a valid state.
//        * @param {Boolean} on Turns autocalculation on (when true) or off (when false)
//        * Calculation is any strip defined processing required after an append/insert to put the carousel in a valid state
//        * Autocalculation is on by default when a carousel is created.
//        */
//       autoCalculate: function autoCalculate(/*on*/) {},

//       _getValidatedIndex: function _getValidatedIndex(array, index) {
//         var endIndex;
//         endIndex = index;
//         if (index < 0) {
//           endIndex = 0;
//         }
//         if (index > array.length) {
//           endIndex = array.length;
//         }
//         return endIndex;
//       },

//       _getOffsetToLastElementInArray: function _getOffsetToLastElementInArray(elementArray) {
//         var length, lastIndex;
//         length = 0;
//         lastIndex = elementArray.length - 1;
//         if (lastIndex >= 0) {
//           length = this._getElementOffset(elementArray[elementArray.length - 1]);
//         }
//         return length;
//       },

//       _getElementOffset: function _getElementOffset(element) {
//         var device;
//         device = this._getDevice();
//         return device.getElementOffset(element)[this._getEdge()];
//       },

//       _getDevice: function _getDevice() {
//         return this.getCurrentApplication().getDevice();
//       },

//       _getDimension: function _getDimension() {
//         return this._orientation.dimension();
//       },

//       _getEdge: function _getEdge() {
//         return this._orientation.edge();
//       },

//       _getWidgetLength: function _getWidgetLength(widget) {
//         return this._getElementLength(widget.outputElement);
//       },

//       _getElementLength: function _getElementLength(element) {
//         var device;
//         device = this._getDevice();
//         return device.getElementSize(element)[this._getDimension()];
//       }
//     }
//   );

//   return WidgetStrip;
// });
