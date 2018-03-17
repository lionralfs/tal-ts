import { Device } from '../devices/base/device';
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
export class Image extends Container {
  public static RENDER_MODE_IMG = 0;
  public static RENDER_MODE_CONTAINER = 1;

  private src: string;
  private size: ISize;
  private imageElement: HTMLImageElement;
  private renderMode: number;

  /**
   * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
   * @param src The image source URL.
   * @param size The size of the image.
   * @param renderMode What mode the image will be rendered in. Either Image.RENDER_MODE_IMG or Image.RENDER_MODE_CONTAINER.
   */
  constructor(id: string, src: string, size?: ISize, renderMode?: 0 | 1) {
    super(id);
    this.src = src;
    this.size = size;
    this.imageElement = null;
    this.renderMode = renderMode === Image.RENDER_MODE_IMG ? Image.RENDER_MODE_IMG : Image.RENDER_MODE_CONTAINER;
    this.addClass('image');
  }

  /**
   * Renders the widget and any child widgets to device-specific output.
   *
   * Returns a device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement)
   *
   * @param device The device to render to.
   */
  public render(device: Device): HTMLElement {
    this.imageElement = device.createImage(this.src, this.id + '_img', [], this.size);
    if (this.renderMode === Image.RENDER_MODE_CONTAINER) {
      super.render(device);
      if (this.size) {
        device.setElementSize(this.outputElement, this.size);
      }
      device.prependChildElement(this.outputElement, this.imageElement);
    } else {
      this.outputElement = this.imageElement;
      device.setElementClasses(this.outputElement, this.getClasses());
    }

    return this.outputElement;
  }

  /**
   * Sets the image source URL.
   * @param src The new image source URL to display.
   */
  public setSrc(src: string): void {
    this.src = src;
    if (this.imageElement) {
      this.imageElement.src = src;
    }
  }

  /**
   * Gets the image source URL.
   * @return The current image source URL.
   */
  public getSrc(): string {
    return this.src;
  }

  public setRenderMode(mode: 0 | 1): void {
    this.renderMode = mode;
  }

  public getRenderMode(): number {
    return this.renderMode;
  }
}
