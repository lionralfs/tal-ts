import { Device } from '../devices/device';
import { Container } from './container';
export interface ISize {
    width?: number;
    height?: number;
    [key: string]: number;
}
/**
 * The Image widget displays an image. It supports lazy loading/unloading of images to conserve memory.
 * You can use CSS to set a background image on the container first and then when the image specified
 * in setSrc is loaded up it will fill the <div> and obscure the background image.
 */
export declare class Image extends Container {
    static RENDER_MODE_IMG: number;
    static RENDER_MODE_CONTAINER: number;
    private src;
    private size;
    private imageElement;
    private renderMode;
    /**
     * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
     * @param src The image source URL.
     * @param size The size of the image.
     * @param renderMode What mode the image will be rendered in. Either Image.RENDER_MODE_IMG or Image.RENDER_MODE_CONTAINER.
     */
    constructor(id: string, src: string, size?: ISize, renderMode?: 0 | 1);
    /**
     * Renders the widget and any child widgets to device-specific output.
     *
     * Returns a device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement)
     *
     * @param device The device to render to.
     */
    render(device: Device): HTMLElement;
    /**
     * Sets the image source URL.
     * @param src The new image source URL to display.
     */
    setSrc(src: string): void;
    /**
     * Gets the image source URL.
     * @return The current image source URL.
     */
    getSrc(): string;
    setRenderMode(mode: 0 | 1): void;
    getRenderMode(): number;
}
