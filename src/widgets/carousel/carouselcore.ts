import { Device, IAnimOptions } from '../../devices/base/device';
import { AfterAlignEvent } from '../../events/afteralignevent';
import { BeforeAlignEvent } from '../../events/beforealignevent';
import { BaseEvent } from '../../events/event';
import { Container } from '../container';
import { Widget } from '../widget';
import { Aligner } from './aligners/aligner';
import { Mask } from './mask';
import { BookendedNavigator } from './navigators/bookendednavigator';
import { Navigator } from './navigators/navigator';
import { Horizontal, HorizontalOrientation } from './orientations/horizontal';
import { Orientation } from './orientations/orientation';
import { Vertical, VerticalOrientation } from './orientations/vertical';
import { WidgetStrip } from './strips/widgetstrip';

/**
 * Ordered list of widgets that can be navigated by moving the list or the selection point
 * Use Carousel instead if you need old container methods.
 */
export class CarouselCore extends Container {
  public static orientations = {
    VERTICAL: Vertical,
    HORIZONTAL: Horizontal
  };

  public orientation: Orientation;
  protected mask: Mask;
  protected widgetStrip: WidgetStrip;
  private autoCalculate: boolean;
  private navigator: Navigator;
  private aligner: Aligner;
  private remapEvent: (evt: any) => void;

  /**
   * @param id The id of the carousel, id_CarouselMask will be used as the id for the mask element
   * and id_WidgetStrip will be used as the id of the widget strip element
   * @param orientation the orientation object of
   * the carousel. Vertical by default, for horizontal pass in `CarouselCore.orientations.HORIZONTAL`
   */
  constructor(id: string, orientation?: Orientation) {
    super(id);

    this.id = id;

    this.setOrientation(orientation || CarouselCore.orientations.VERTICAL);
    // this.setOrientation(orientation);
    this.setWidgetStrip(WidgetStrip);
    this.mask = new Mask(this.id + '_CarouselMask', this.widgetStrip, this.orientation);
    this.directAppend(this.mask);
    this.setNavigator(BookendedNavigator);
    this.aligner = new Aligner(this.mask);
    this.setAlignEventsFromStripToHaveCarouselAsTarget();
    this.autoCalculate = true;
  }

  /**
   * Renders the widget and any child widgets to device-specific output.
   * @param device The device to render to.
   * @return A device-specific object that represents the Carousel as displayed on the device
   * (in a browser, two nested DIVs with the inner containing child widgets and the outer acting as a mask);
   */
  public render(device: Device): HTMLElement {
    this.outputElement = this.mask.render(device);
    return this.outputElement;
  }

  /**
   * Adds a widget to the end of the carousel
   * @param widget The widget to append to the carousel
   * @param length the length of the widget in pixels, measured along the primary axis.
   * (Height for a vertical carousel or width for horizontal.) If providied, this value will be used in
   * positioning calculations rather then a calculated value (can be useful when widgets change size)
   * Note length only currently working with non-wrapping strips.
   */
  public append(widget: Widget, length?: number): Widget {
    widget.addClass('carouselItem');
    return this.widgetStrip.append(widget, length);
  }

  /**
   * Adds a widget to the end of the carousel
   * @param index A zero based index to begin insertion at, i.e. 0 prepends.
   * @param widget The widget to append to the carousel
   * @param length the length of the widget in pixels, measured along the primary axis.
   * (Height for a vertical carousel or width for horizontal.) If provided, this value will be used in
   * positioning calculations rather then a calculated value (can be useful when widgets change size)
   * Note length only currently working with non-wrapping strips.
   */
  public insert(index: number, widget: Widget, length?: number): Widget {
    widget.addClass('carouselItem');
    return this.widgetStrip.insert(index, widget, length);
  }

  /**
   * Manually sets lengths of elements for movement calculations - useful for elements which change size while moving.
   * @param lengths If provided with a number all lengths will be set equal to this number
   * If provided with an array, the lengths will be set with the corresponding widgets (so the first number will be used
   * for the first widget's length, etc..)
   * Note only currently working with non-wrapping strips.
   */
  public setWidgetLengths(lengths: number | number[]): void {
    this.widgetStrip.setLengths(lengths);
  }

  /**
   * Manually sets length of te Mask. Normally this is measured from the DOM, but if the first alignment happens before
   * the DOM is ready, then culling strips may not get populated. In this case, call this first with the size in pixels of
   * the mask.
   * @param length The length in pixels to use in Mask calculations.
   */
  public setMaskLength(length: number): void {
    this.mask.setLength(length);
  }

  /**
   * Removes a widget from the carousel
   * @param widget Widget to remove from the DOM
   * @param retainElement Whether to keep the widget's output element in the DOM after removing widget
   */
  public remove(widget: Widget, retainElement = false): void {
    if (this.hasChildWidget(widget.id)) {
      widget.removeClass('carouselItem');
      this.widgetStrip.remove(widget, retainElement);
    }
  }

  /**
   * Removes all widgets from the carousel
   */
  public removeAll(): void {
    this.widgetStrip.removeAll();
  }

  /**
   * Aligns the carousel to the next enabled widget after that currently aligned.
   * If no alignment has been performed previously it will align to the next enabled widget after that at index 0
   * If a wrapping strip and navigator are used the alignment will wrap to the start after the last widget is reached.
   * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
   * @param options An animation options object
   * @param options.fps The frames per second of the alignment, if using styletopleft animation
   * @param options.duration The duration of the alignment in ms
   * @param options.easing The alignment easing function
   * @param options.skipAnim If set true, the alignment will complete instantly then fire any provided callback
   * @param options.onComplete A function which will be executed on completion of the alignment animation.
   */
  public alignNext(options?: IAnimOptions): void {
    this.aligner.alignNext(this.navigator, options);
  }

  /**
   * Aligns the carousel to the enabled widget before that currently aligned.
   * If no alignment has been performed previously it will align to the first enabled widget before that at index 0
   * If a wrapping strip and navigator are used the alignment will wrap to the end after the first widget is reached.
   * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
   * @param options An animation options object
   * @param options.fps The frames per second of the alignment, if using styletopleft animation
   * @param options.duration The duration of the alignment in ms
   * @param options.easing The alignment easing function
   * @param options.skipAnim If set true, the alignment will complete instantly then fire any provided callback
   * @param options.onComplete A function which will be executed on completion of the alignment animation.
   */
  public alignPrevious(options?: IAnimOptions): void {
    this.aligner.alignPrevious(this.navigator, options);
  }

  /**
   * Aligns the carousel to the widget at the specified index
   * Will always move forward if the index is after that currently aligned and backwards if index is before
   * that currently aligned.
   * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
   * @param index The index of the widget to align on.
   * @param options An animation options object
   * @param options.fps The frames per second of the alignment, if using styletopleft animation
   * @param options.duration The duration of the alignment in ms
   * @param options.easing The alignment easing function
   * @param options.skipAnim If set true, the alignment will complete instantly then fire any provided callback
   * @param options.onComplete A function which will be executed on completion of the alignment animation.
   */
  public alignToIndex(index: number, options?: IAnimOptions): void {
    this.aligner.alignToIndex(index, options);
  }

  /**
   * Instantly completes any in-flight alignment animations, firing any callbacks that were provided.
   * If several alignments have been queued, all will complete in order.
   */
  public completeAlignment(): void {
    this.aligner.complete();
  }

  /**
   * Sets the point along the Mask at which alignments are made
   * @param pixelsFromEdgeToWidgetEdge A value in pixels from the primary edge (top or left for Vertical/Horizontal)
   * at which widgets are aligned.
   */
  public setAlignPoint(pixelsFromEdgeToWidgetEdge: number): void {
    this.mask.setAlignPoint(pixelsFromEdgeToWidgetEdge);
  }

  /**
   * Sets the point along the Mask at which alignments are made
   * @param fractionOfMaskLength a value between 0 and 1 specifying how far along the mask a widget should
   * be aligned. i.e. 0.5 is the centre of the mask.
   */
  public setNormalisedAlignPoint(fractionOfMaskLength: number): void {
    this.mask.setNormalisedAlignPoint(fractionOfMaskLength);
  }

  /**
   * Sets the point along the aligned widget at which alignments are made
   * @param fractionOfWidgetLength a value between 0 and 1 specifying the point along the widget which will be
   * aligned with the mask alignment point. i.e. in a horizontal Carousel, 0.5 is the centre of the widget,
   * 0 is the left edge, 1 is the right edge
   */
  public setNormalisedWidgetAlignPoint(fractionOfWidgetLength: number): void {
    this.mask.setNormalisedWidgetAlignPoint(fractionOfWidgetLength);
  }

  /**
   * Some widget strips peform calculations which require elements to be present in the document.
   * This method manually performs those recalculations.
   */
  public recalculate(): void {
    this.widgetStrip.recalculate();
  }

  /**
   * Some widget strips peform calculations which require elements to be present in the document.
   * By default these calculations are performed whenever their values might be invalidated (after appending elements
   * for instance) This method can be used to be disable/enable this behaviour for performance optimisation.
   */
  public setAutoCalculate(on: boolean): void {
    this.widgetStrip.autoCalculate(on);
  }

  /**
   * @return the index of the currently active widget
   */
  public getActiveIndex(): number {
    return this.navigator.currentIndex();
  }

  /**
   * Sets the currently active index
   * @param index the index of the widget to be made active.
   * If this is invalid or corresponds to a disabled widget the active index will not change
   */
  public setActiveIndex(index: number): void {
    this.navigator.setIndex(index);
  }

  /**
   * @return the index first focussable index after the index of the active widget
   */
  public nextIndex(): number {
    return this.navigator.nextIndex();
  }

  /**
   * @return the index first focussable index before the index of the active widget
   */
  public previousIndex(): number {
    return this.navigator.previousIndex();
  }

  /**
   * Sets the currently active widget
   * @param widget the widget to be made active.
   * If the widget is not in the Carousel or corresponds to a disabled widget the active widget will not change
   */
  public setActiveWidget(widget: Widget): void {
    const index = this.widgetStrip.getIndexOfChildWidget(widget);
    this.navigator.setIndex(index);
  }

  /**
   * Sets the navigator class used to determine focus position
   * @param navigator the constructor function of the type of navigator the carousel should use, e.g.
   * antie.widgets.carousel.navigators.BookendedNavigator or antie.widgets.carousel.navigators.WrappingNavigator
   * On construction, the carousel uses antie.widgets.carousel.navigators.BookendedNavigator by default
   */
  public setNavigator(navigator: new (container: Container) => Navigator): void {
    this.navigator = new navigator(this.widgetStrip);
  }

  /**
   * Sets the widget strip class used to manage widgets and elements within the carousel
   * @param widgetStrip the constructor function of the type of Widget strip the carousel should use, e.g.
   * antie.widgets.carousel.navigators.WidgetStrip, antie.widgets.carousel.navigators.WrappingStrip
   * On construction, the carousel uses antie.widgets.carousel.navigators.WidgetStrip by default
   */
  public setWidgetStrip(widgetStrip: new (id: string, orientation: Orientation) => WidgetStrip): void {
    this.widgetStrip = new widgetStrip(this.id + '_WidgetStrip', this.orientation);
    if (this.navigator) {
      this.navigator.setContainer(this.widgetStrip);
    }
    if (this.mask) {
      this.mask.setWidgetStrip(this.widgetStrip);
    }
  }

  /**
   * @return The widgets currently in the carousel
   */
  public items(): Widget[] {
    return this.widgetStrip.widgets();
  }

  /**
   * @return The orientation object associated with the carousel
   */
  public getOrientation(): Orientation {
    return this.orientation;
  }

  protected directAppend(widget: Widget): void {
    this.appendChildWidget(widget);
  }

  private setOrientation(orientation: Orientation): void {
    this.orientation = orientation;
  }

  private setAlignEventsFromStripToHaveCarouselAsTarget(): void {
    this.remapWidgetStripEventToCarousel('beforealign');
    this.remapWidgetStripEventToCarousel('afteralign');
  }

  private remapWidgetStripEventToCarousel(eventName): void {
    const fallback = evt => {
      if (evt.target === this.widgetStrip) {
        evt.target = this;
      }
    };
    this.remapEvent = this.remapEvent || fallback;
    this.addEventListener(eventName, this.remapEvent);
  }
}
