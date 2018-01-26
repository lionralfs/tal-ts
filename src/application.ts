import { BaseClass } from './class';
import { RuntimeContext, IRuntimeContext } from './runtimecontext';
import { Widget } from './widgets/widget';
import { Device } from './devices/device';

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

export class Application extends BaseClass implements IApplication {
  static runtimeContext: IRuntimeContext = RuntimeContext;

  static getCurrentApplication() {
    return this.runtimeContext.getCurrentApplication();
  }

  private rootElement: Element;
  private rootWidget: Widget = null;
  private focussedWidget: Widget = null;
  private onReadyHandler: Function;
  private device: Device;

  private layout: any; // TODO

  constructor(
    rootElement: Element,
    styleBaseUrl: string,
    imageBaseUrl: string,
    onReadyHandler: Function,
    configOverride: IConfiguration
  ) {
    super();

    Application.runtimeContext.setCurrentApplication(this);

    this.rootElement = rootElement;
    this.rootWidget = null;
    this.focussedWidget = null;
    this.onReadyHandler = onReadyHandler;

    const config: IConfiguration = configOverride || antie.framework.deviceConfiguration;

    const deviceLoaded = (device: Device): void => {
      let i;
      this.device = device;
      device.setApplication(this);
      device.addKeyEventListener();
      let layout = this.getBestFitLayout();
      layout.css = layout.css || [];
      if (config.css) {
        for (i = 0; i < config.css.length; i++) {
          if (config.css[i].width === layout.width && config.css[i].height === layout.height) {
            layout.css = layout.css.concat(config.css[i].files);
          }
        }
      }

      requirejs([layout.module], (layout: ILayout) => {
        this.setLayout(layout, styleBaseUrl, imageBaseUrl, layout.css, layout.classes, [], () => {
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

  public run() {
    // intentionally left blank
  }

  public route(route: string[]) {
    // intentionally left blank
  }

  public addComponentContainer(id: any, module: any, args: any) {
    var container = new ComponentContainer(id);
    this.rootWidget.appendChildWidget(container);

    if (module) {
      this.showComponent(id, module, args);
    }

    return container;
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
    let tle = this.device.getTopLevelElement();

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
      const self = this;
      const cssLoadedCallback = () => {
        if (++currentlyLoadingIndex < css.length) {
          self.device.loadStyleSheet(styleBaseUrl + css[currentlyLoadingIndex], cssLoadedCallback);
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
