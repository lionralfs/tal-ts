import { Container } from '..';
import { CarouselCore } from './carousel/carouselcore';
import { HorizontalOrientation } from './carousel/orientations/horizontal';
import { VerticalOrientation } from './carousel/orientations/vertical';
import { Widget } from './widget';
export declare class Carousel extends CarouselCore {
    static orientations: {
        VERTICAL: VerticalOrientation;
        HORIZONTAL: HorizontalOrientation;
    };
    /**
     * Appends a child widget to this widget.
     * @param widget The child widget to add.
     */
    appendChildWidget(widget: Widget): Widget;
    /**
     * Inserts a child widget at the specified index.
     * @param index The index where to insert the child widget.
     * @param widget The child widget to add.
     */
    insertChildWidget(index: number, widget: Widget): Widget;
    /**
     * Removes a specific child widget from this widget.
     * @param widget The child widget to remove.
     * @param retainElement Pass <code>true</code> to retain the child output element of the given widget
     */
    removeChildWidget(widget: Widget, retainElement?: boolean): void;
    /**
     * Remove all child widgets from this widget.
     */
    removeChildWidgets(): void;
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
     * @return Boolean true if the child widget was focusable, otherwise boolean false.
     */
    setActiveChildWidget(widget: Widget): boolean;
    /**
     * Checks to see if a specific widget is a direct child of this widget.
     * @param id The widget to check to see if it is a direct child of this widget.
     */
    hasChildWidget(id: string): boolean;
    /**
     * Get the current active widget.
     * @return The current active widget
     */
    getActiveChildWidget(): Container;
    /**
     * Get a child widget from its unique ID.
     * @param id The id of the child widget to return.
     * @return of the widget with the given ID, otherwise undefined if the child does not exist.
     */
    getChildWidget(id: string): Widget;
    /**
     * Gets the number of direct child widgets.
     * @return The number of direct child widgets.
     */
    getChildWidgetCount(): number;
    /**
     * Get an array of all this widget's children.
     * @return An array of all this widget's children.
     */
    getChildWidgets(): Widget[];
    /**
     * Attempts to set focus to the child widget at the given index.
     * @see #setActiveChildWidget
     * @param index Index of the child widget to set focus to.
     * @return Boolean true if the child widget was focusable, otherwise boolean false.
     */
    setActiveChildIndex(index: number): boolean;
    /**
     * @see #setActiveChildWidget
     * @return Index of the child widget that is currently active.
     */
    getActiveChildIndex(): number;
    /**
     * Adds a CSS class to the widget strip if not already present.
     * @param className The class name to add.
     */
    addClass(className: string): void;
    /**
     * Checks to see if the widget strip has a given CSS class.
     * @param className The class name to check.
     * @return Boolean true if the device has the className. Otherwise boolean false.
     */
    hasClass(className: string): boolean;
    /**
     * Removes a CSS class from the widget strip if present.
     * @param className The class name to remove.
     */
    removeClass(className: string): void;
    /**
     * Get an array of class names that this widget strip has.
     * @return An array of class names (Strings)
     */
    getClasses(): string[];
    protected directAppend(widget: Widget): void;
}
