import { BaseClass } from '../class';
import { Application } from '../application';

export interface IDeviceCallbacks {
  onSuccess(deviceClass: Device): void;
  onError(ex: any): void;
}

export interface IDevice {
  setApplication(app: Application): void;
  addKeyEventListener(): void;
  getTopLevelElement(): Element;
  addClassToElement(el: Element, className: string): void;
  preloadImage(url: string): void;
  loadStyleSheet(url: string, callback: (res?: string) => void): void;
  getCurrentRoute(): string[];
}

export class Device extends BaseClass implements IDevice {
  private application: Application;
  private config: object;
  private keyMap: object;

  constructor(config: object) {
    super();

    this.application = null;
    this.config = config;
    this.keyMap = {};
  }

  static load(config, callbacks: IDeviceCallbacks) {
    try {
      requirejs([config.modules.base].concat(config.modules.modifiers), function(DeviceClass) {
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

  public setApplication(app: Application) {
    this.application = app;
  }

  public addKeyEventListener() {}

  public getTopLevelElement() {
    return document.createElement('div');
  }

  public addClassToElement(el: Element, className: string) {}

  public preloadImage(url: string) {}

  public loadStyleSheet(url: string, callback?: (res: string) => void): void {}

  public getCurrentRoute() {
    return ['a'];
  }
}