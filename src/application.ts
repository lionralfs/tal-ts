import { BaseClass } from './class';
import { Device } from './devices/device';
import { IRuntimeContext, RuntimeContext } from './runtimecontext';
import { Container } from './widgets/container';
import { Widget } from './widgets/widget';

export interface ILayout {
  classes: string[];
  css: IConfigCss[];
  width: number;
  height: number;
  module: string;
  preloadImages?: string[];
}

export interface IConfiguration {
  css?: IConfigCss[];
  modules: {
    base: string;
    modifiers: string[];
  };
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
}

export abstract class Application extends BaseClass implements IApplication {
  public static getCurrentApplication() {
    return this.runtimeContext.getCurrentApplication();
  }

  private static runtimeContext: IRuntimeContext = RuntimeContext;

  private rootElement: Element;
  private rootWidget: Container = null;
  private focussedWidget: Widget = null;
  private onReadyHandler: () => void;
  private device: Device;

  private layout: any; // TODO

  constructor(
    rootElement: Element,
    styleBaseUrl: string,
    imageBaseUrl: string,
    onReadyHandler: () => void,
    configOverride?: IConfiguration
  ) {
    super();

    Application.runtimeContext.setCurrentApplication(this);

    this.rootElement = rootElement;
    this.rootWidget = null;
    this.focussedWidget = null;
    this.onReadyHandler = onReadyHandler;

    const config: IConfiguration = configOverride || antie.framework.deviceConfiguration;

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
    const container = new ComponentContainer(id);
    this.rootWidget.appendChildWidget(container);

    if (requireModule) {
      this.showComponent(id, requireModule, args);
    }

    return container;
  }

  public showComponent(id: string, requireModule: string, args?: object) {
    this.rootWidget.getChildWidget(id).show(requireModule, args);
  }

  public getDevice() {
    return this.device;
  }

  public getBestFitLayout(): ILayout {
    return {
      classes: ['asdf'],
      css: [
        {
          width: 100,
          height: 200,
          files: []
        }
      ],
      width: 100,
      height: 200,
      module: 'asdf'
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
}
