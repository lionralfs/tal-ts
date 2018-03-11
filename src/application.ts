import { BaseClass } from './class';
import { BrowserDevice } from './devices/browserdevice';
import { Device, IDeviceConfig } from './devices/device';
import { BaseEvent } from './events/event';
import { IRuntimeContext, RuntimeContext } from './runtimecontext';
import { Button } from './widgets/button';
import { Component } from './widgets/component';
import { ComponentContainer } from './widgets/componentcontainer';
import { Container } from './widgets/container';
import { List } from './widgets/list';
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
  addComponentContainer(id: string, component?: Component, args?: object): void;
  showComponent(id: string, component: Component, args?: object): void;
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
  public static getCurrentApplication(): Application {
    return this.runtimeContext.getCurrentApplication();
  }

  private static runtimeContext: IRuntimeContext = RuntimeContext;

  private rootElement: HTMLElement;
  private rootWidget: Container = null;
  private focussedWidget: Button = null;
  private onReadyHandler: (...args: any[]) => void;
  private device: Device;

  private layout: ILayout;

  constructor(
    rootElement: HTMLElement,
    styleBaseUrl: string,
    imageBaseUrl: string,
    onReadyHandler?: (...args: any[]) => void,
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

      setTimeout(() => {
        this.setLayout(
          {
            classes: [],
            css: [],
            width: 1280,
            height: 720,
            module: ''
          },
          styleBaseUrl,
          imageBaseUrl,
          [],
          [],
          [],
          () => {
            this.run();
            this.route(device.getCurrentRoute());
          }
        );
      }, 1000);
      // requirejs([layout.module], (loadedLayout: ILayout) => {
      //   this.setLayout(loadedLayout, styleBaseUrl, imageBaseUrl, loadedLayout.css, loadedLayout.classes, [], () => {
      //     this.run();
      //     this.route(device.getCurrentRoute());
      //   });
      // });
    };

    if (!this.device) {
      deviceLoaded(new BrowserDevice(config));
      // Device.load(config, {
      //   onSuccess: deviceLoaded,
      //   onError: function onError(err) {
      //     console.error('Unable to load device', err);
      //   }
      // });
    } else {
      deviceLoaded(this.device);
    }
  }

  public abstract run(): void;

  public abstract route(route: string[]): void;

  /**
   * Must be called when the application startup is complete and application can accept user input.
   */
  public ready(): void {
    if (this.onReadyHandler) {
      // Run this after the current execution path is complete
      window.setTimeout(() => {
        this.onReadyHandler(this);
      }, 0);
    }
  }

  public addComponentContainer(id: string, component?: Component, args?: object): Container {
    const container: Container = new ComponentContainer(id);
    this.rootWidget.appendChildWidget(container);

    if (component) {
      this.showComponent(id, component, args);
    }

    return container;
  }

  public showComponent(id: string, component: Component, args?: object): void {
    const widget = this.rootWidget.getChildWidget(id);
    if (widget instanceof ComponentContainer) {
      widget.showComponent(component, args);
    }
  }

  /**
   * Pushes a component into the history stack of a container (and shows it).
   * @param id The ID of the container into which to show the component.
   * @param modules The requirejs module name of the component to show.
   * @param args An optional object to pass arguments to the component.
   */
  public pushComponent(id: string, component: Component, args?: object): void {
    this.rootWidget.getChildWidget(id).pushComponent(component, args);
  }

  public getDevice(): Device {
    return this.device;
  }

  public bubbleEvent(evt: BaseEvent): void {
    if (this.focussedWidget) {
      this.focussedWidget.bubbleEvent(evt);
    }
  }

  /**
   * Set the currently focussed Button.
   * @param button The button that has recieved focus.
   */
  public setFocussedWidget(button: Button): void {
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
  ): void {
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
  public setRootWidget(widget: Container): void {
    widget.addClass('rootwidget');
    if (widget instanceof List) {
      widget.setRenderMode(List.RENDER_MODE_CONTAINER);
    }
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

  public getFocussedWidget(): Button {
    return this.focussedWidget;
  }

  /**
   * Removes an event listener from the root widget.
   * @param evt The event to handle.
   * @param handler The handler function to remove.
   */
  public removeEventListener(evt: string, handler: (...args: any[]) => void): void {
    this.rootWidget.removeEventListener(evt, handler);
  }

  /**
   * Destroys the application, allowing you to run another. This is mainly for use when building
   * unit or BDD tests.
   */
  public destroy(): void {
    RuntimeContext.clearCurrentApplication();
  }

  /**
   * Navigates back to whatever launched the application (a parent TAL application, broadcast, or exit).
   */
  public back(): void {
    const historian = this.getDevice().getHistorian();
    if (historian.hasHistory()) {
      this.getDevice().setWindowLocationUrl(historian.back());
    } else {
      this.exit();
    }
  }

  /**
   * Returns a Boolean value to indicate whether the application can go back to a parent TAL application.
   * Returns `true` if the application can return to a parent TAL application.
   */
  public hasHistory(): boolean {
    return this.getDevice()
      .getHistorian()
      .hasHistory();
  }

  /**
   * Exits the application by using the configured exit strategy for the device, even if there is a parent TAL
   * application in the history stack. Will exit to broadcast if the first TAL application was launched from
   * broadcast and a broadcast exit modifier is loaded.
   */
  public exit(): void {
    if (
      this.getDevice()
        .getHistorian()
        .hasBroadcastOrigin()
    ) {
      this.getDevice().exitToBroadcast();
    } else {
      this.getDevice().exit();
    }
  }
}
