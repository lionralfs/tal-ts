import { Container } from '../container';
/**
 * Ordered list of widgets that can be navigated by moving the list or the selection point
 * Use Carousel instead if you need old container methods.
 */
export declare class CarouselCore extends Container {
    private mask;
    private widgetStrip;
    private orientation;
    private autoCalculate;
    /**
     * @param id The id of the carousel, id_CarouselMask will be used as the id for the mask element
     * and id_WidgetStrip will be used as the id of the widget strip element
     * @param orientation the orientation object of
     * the carousel. Vertical by default, for horizontal pass in antie.widgets.carousel.CarouselCore.orientations.HORIZONTAL
     */
    constructor(id: string, orientation: number);
}
