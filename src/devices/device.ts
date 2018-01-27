import { Application, IConfiguration } from '../application';
import { BaseClass } from '../class';

export interface IDeviceCallbacks {
  onSuccess(deviceClass: Device): void;
  onError(ex: any): void;
}

export interface IDevice {
  setApplication(app: Application): void;
  addKeyEventListener(): void;
  getTopLevelElement(): Node;
  addClassToElement(el: Element, className: string): void;
  preloadImage(url: string): void;
  loadStyleSheet(url: string, callback: (res?: string) => void): void;
  getCurrentRoute(): string[];
  setElementClasses(el: Element, classNames: string[]): void;
}

export abstract class Device extends BaseClass implements IDevice {
  public static load(config: IConfiguration, callbacks: IDeviceCallbacks) {
    try {
      requirejs([config.modules.base].concat(config.modules.modifiers), DeviceClass => {
        try {
          callbacks.onSuccess(new DeviceClass(config));
        } catch (ex) {
          if (callbacks.onError) {
            callbacks.onError(ex);
          }
        }
      });
    } catch (ex) {
      if (callbacks.onError) {
        callbacks.onError(ex);
      }
    }
  }

  private application: Application;
  private config: object;
  private keyMap: object;

  constructor(config: object) {
    super();

    this.application = null;
    this.config = config;
    this.keyMap = {};
  }

  public setApplication(app: Application) {
    this.application = app;
  }

  public abstract addKeyEventListener();

  public abstract getTopLevelElement();

  public abstract addClassToElement(el: Element, className: string);

  public abstract preloadImage(url: string);

  public abstract loadStyleSheet(url: string, callback?: (res: string) => void);

  public abstract getCurrentRoute();

  public abstract setElementClasses(el: Node, classNames: string[]);
}
