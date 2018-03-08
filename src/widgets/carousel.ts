import { Container } from '..';
import { CarouselCore } from './carousel/carouselcore';
import { Widget } from './widget';

export class Carousel extends CarouselCore {
  // public static orientations = CarouselCore.orientations;
  /**
   * Appends a child widget to this widget.
   * @param widget The child widget to add.
   */
  public appendChildWidget2(widget: Widget) {
    return this.append(widget);
  }

  /**
   * Inserts a child widget at the specified index.
   * @param index The index where to insert the child widget.
   * @param widget The child widget to add.
   */
  public insertChildWidget(index: number, widget: Widget) {
    return this.insert(index, widget);
  }

  /**
   * Removes a specific child widget from this widget.
   * @param widget The child widget to remove.
   * @param retainElement Pass <code>true</code> to retain the child output element of the given widget
   */
  public removeChildWidget(widget: Widget, retainElement?: boolean) {
    return this.remove(widget, retainElement);
  }

  /**
   * Remove all child widgets from this widget.
   */
  public removeChildWidgets() {
    return this.removeAll();
  }

  /**
   * Attempt to set focus to the given child widget.
   *
   * Note: You can only set focus to a focusable widget. A focusable widget is one that
   * contains an enabled antie.widgets.Button as either a direct or indirect child.
   *
   * Note: Widgets have 2 independent states: active and focussed. A focussed widget is
   * either the Button with focus, or any parent of that Button. An active widget is
   * one which is the active child of its parent Container. When the parent widget
   * receives focus, focus will be placed on the active child.
   *
   * Classes 'active' and 'focus' are appended to widgets with these states.
   *
   * @param widget The child widget to set focus to.
   * @returns Boolean true if the child widget was focusable, otherwise boolean false.
   */
  public setActiveChildWidget(widget: Widget): boolean {
    if (widget === this.mask) {
      return super.setActiveChildWidget(widget);
    } else {
      this.setActiveWidget(widget);
      return false;
    }
  }

  /**
   * Checks to see if a specific widget is a direct child of this widget.
   * @param id The widget to check to see if it is a direct child of this widget.
   */
  public hasChildWidget(id: string) {
    if (id === this.mask.id) {
      return super.hasChildWidget(id);
    } else {
      return this.widgetStrip.hasChildWidget(id);
    }
  }

  /**
   * Get the current active widget.
   * @return The current active widget
   */
  public getActiveChildWidget() {
    return this.widgetStrip.getActiveChildWidget();
  }

  /**
   * Get a child widget from its unique ID.
   * @param id The id of the child widget to return.
   * @return of the widget with the given ID, otherwise undefined if the child does not exist.
   */
  public getChildWidget(id: string) {
    if (id === this.mask.id) {
      return this.mask;
    } else {
      return this.widgetStrip.getChildWidget(id);
    }
  }

  /**
   * Gets the number of direct child widgets.
   * @return The number of direct child widgets.
   */
  public getChildWidgetCount() {
    return this.widgetStrip.getChildWidgetCount();
  }

  /**
   * Get an array of all this widget's children.
   * @return An array of all this widget's children.
   */
  public getChildWidgets() {
    return this.items();
  }

  /**
   * Attempts to set focus to the child widget at the given index.
   * @see #setActiveChildWidget
   * @param index Index of the child widget to set focus to.
   * @return Boolean true if the child widget was focusable, otherwise boolean false.
   */
  public setActiveChildIndex(index: number): boolean {
    this.setActiveIndex(index);
    return false;
  }

  /**
   * @see #setActiveChildWidget
   * @return Index of the child widget that is currently active.
   */
  public getActiveChildIndex(): number {
    return this.getActiveIndex();
  }

  /**
   * Adds a CSS class to the widget strip if not already present.
   * @param className The class name to add.
   */
  public addClass(className: string) {
    if (this.widgetStrip) {
      return this.widgetStrip.addClass(className);
    }
  }

  /**
   * Checks to see if the widget strip has a given CSS class.
   * @param className The class name to check.
   * @returns Boolean true if the device has the className. Otherwise boolean false.
   */
  public hasClass(className: string) {
    if (this.widgetStrip) {
      return this.widgetStrip.hasClass(className);
    } else {
      return false;
    }
  }

  /**
   * Removes a CSS class from the widget strip if present.
   * @param className The class name to remove.
   */
  public removeClass(className: string) {
    if (this.widgetStrip) {
      return this.widgetStrip.removeClass(className);
    }
  }

  /**
   * Get an array of class names that this widget strip has.
   * @return An array of class names (Strings)
   */
  public getClasses() {
    if (this.widgetStrip) {
      return this.widgetStrip.getClasses();
    } else {
      return [];
    }
  }

  protected directAppend(widget: Widget) {
    Container.prototype.appendChildWidget.call(this, widget);
  }
}
