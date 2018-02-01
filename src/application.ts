import { BaseClass } from './class';
import { Device, IDeviceConfig } from './devices/device';
import { BaseEvent } from './events/event';
import { IRuntimeContext, RuntimeContext } from './runtimecontext';
import { Button } from './widgets/button';
import { ComponentContainer } from './widgets/componentcontainer';
import { Container } from './widgets/container';
import { Widget } from './widgets/widget';

declare const antie: { framework: { deviceConfiguration: IDeviceConfig } };
export interface ILayout {
  classes: string[];
  css: IConfigCss[];
  width: number;
  height: number;
  module: string;
  preloadImages?: string[];
}

export interface IConfigCss {
  width: number;
  height: number;
  files: IConfigCss[];
}

export interface IApplication {
  run(): void;
  getBestFitLayout(): ILayout;
  addComponentContainer(id: any, module: any, args: any): any;
  showComponent(id: string, requireModule: string, args?: object): void;
  setLayout(
    layout: ILayout,
    styleBaseUrl: string,
    imageBaseUrl: string,
    additionalCSS: IConfigCss[],
    additionalClasses: string[],
    additionalPreloadImages: string[],
    callback: () => void
  ): void;
  route(route: string[]): void;
  getDevice(): Device;
  bubbleEvent(evt: BaseEvent): void;
  getFocussedWidget(): Button;
}

export abstract class Application extends BaseClass implements IApplication {
  public static getCurrentApplication() {
    return this.runtimeContext.getCurrentApplication();
  }

  private static runtimeContext: IRuntimeContext = RuntimeContext;

  private rootElement: Element;
  private rootWidget: Container = null;
  private focussedWidget: Button = null;
  private onReadyHandler: (...args: any[]) => void;
  private device: Device;

  private layout: any; // TODO

  constructor(
    rootElement: Element,
    styleBaseUrl: string,
    imageBaseUrl: string,
    onReadyHandler: (...args: any[]) => void,
    configOverride?: IDeviceConfig
  ) {
    super();

    Application.runtimeContext.setCurrentApplication(this);

    this.rootElement = rootElement;
    this.rootWidget = null;
    this.focussedWidget = null;
    this.onReadyHandler = onReadyHandler;

    const config: IDeviceConfig = configOverride || antie.framework.deviceConfiguration;

    const deviceLoaded = (device: Device): void => {
      let i: number;
      this.device = device;
      device.setApplication(this);
      device.addKeyEventListener();
      const layout = this.getBestFitLayout();
      layout.css = layout.css || [];
      if (config.css) {
        for (i = 0; i < config.css.length; i++) {
          if (config.css[i].width === layout.width && config.css[i].height === layout.height) {
            layout.css = layout.css.concat(config.css[i].files);
          }
        }
      }

      requirejs([layout.module], (loadedLayout: ILayout) => {
        this.setLayout(loadedLayout, styleBaseUrl, imageBaseUrl, loadedLayout.css, loadedLayout.classes, [], () => {
          this.run();
          this.route(device.getCurrentRoute());
        });
      });
    };

    if (!this.device) {
      Device.load(config, {
        onSuccess: deviceLoaded,
        onError: function onError(err) {
          console.error('Unable to load device', err);
        }
      });
    } else {
      deviceLoaded(this.device);
    }
  }

  public abstract run();

  public abstract route(route: string[]);

  public addComponentContainer(id: any, requireModule: any, args: any) {
    const container: Container = new ComponentContainer(id);
    this.rootWidget.appendChildWidget(container);

    if (requireModule) {
      this.showComponent(id, requireModule, args);
    }

    return container;
  }

  public showComponent(id: string, requireModule: string, args?: object) {
    const widget = this.rootWidget.getChildWidget(id);
    if (widget instanceof ComponentContainer) {
      widget.showComponent(requireModule, args);
    }
  }

  public getDevice() {
    return this.device;
  }

  public bubbleEvent(evt: BaseEvent) {
    if (this.focussedWidget) {
      this.focussedWidget.bubbleEvent(evt);
    }
  }

  /**
   * Set the currently focussed Button.
   * @param button The button that has recieved focus.
   */
  public setFocussedWidget(button: Button) {
    // Check to see the widget is a Button and itself has correct focus state before recording
    // it as the focussed widget.
    if (button instanceof Button && button.isFocussed()) {
      this.focussedWidget = button;
    }
  }

  public getBestFitLayout(): ILayout {
    // TODO: add actual implementation
    return {
      classes: ['browserdevice720p'],
      css: [],
      height: 720,
      module: 'layouts/layout720p',
      width: 1280
    };
  }

  public setLayout(
    layout: ILayout,
    styleBaseUrl: string,
    imageBaseUrl: string,
    additionalCSS: IConfigCss[],
    additionalClasses: string[],
    additionalPreloadImages: string[],
    callback: () => void
  ) {
    let i;
    this.layout = layout;
    const tle = this.device.getTopLevelElement();

    let classes = layout.classes || [];
    if (additionalClasses) {
      classes = classes.concat(additionalClasses);
    }
    for (i = 0; i !== classes.length; i += 1) {
      this.device.addClassToElement(tle, classes[i]);
    }

    let preloadImages = layout.preloadImages || [];
    if (additionalPreloadImages) {
      preloadImages = preloadImages.concat(additionalPreloadImages);
    }
    for (i = 0; i !== preloadImages.length; i += 1) {
      this.device.preloadImage(imageBaseUrl + preloadImages[i]);
    }

    let css = layout.css || [];
    if (additionalCSS) {
      css = css.concat(additionalCSS);
    }
    if (callback) {
      let currentlyLoadingIndex = -1;
      const cssLoadedCallback = () => {
        if (++currentlyLoadingIndex < css.length) {
          this.device.loadStyleSheet(styleBaseUrl + css[currentlyLoadingIndex], cssLoadedCallback);
        } else {
          callback();
        }
      };
      cssLoadedCallback();
    } else {
      for (i = 0; i !== css.length; i += 1) {
        this.device.loadStyleSheet(styleBaseUrl + css[i]);
      }
    }
  }

  /**
   * Set the root widget of the application.
   * @param widget The new root widget.
   */
  public setRootWidget(widget: Container) {
    widget.addClass('rootwidget');
    // if (widget instanceof List) {
    //   widget.setRenderMode(List.RENDER_MODE_CONTAINER);
    // }
    this.rootWidget = widget;
    this.rootWidget.focussed = true;
    if (!this.rootWidget.outputElement) {
      const device = this.getDevice();
      device.appendChildElement(this.rootElement, widget.render(device));
    }

    if (this.onReadyHandler) {
      this.rootWidget.addEventListener('applicationready', e => {
        this.onReadyHandler(e);
      });
    }
  }

  /**
   * Get the root widget of the application.
   *
   * Returns the root widget of the application.
   */
  public getRootWidget(): Container {
    return this.rootWidget;
  }

  public getFocussedWidget() {
    return this.focussedWidget;
  }
}
