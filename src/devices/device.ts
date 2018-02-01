import { Application, IConfigCss, ILayout } from '../application';
import { BaseClass } from '../class';
import { KeyEvent } from '../events/keyevent';
import { IShowOptions } from '../widgets/widget';

// TODO: this needs more checks
export interface IDeviceConfig {
  pageStrategy?: string;
  css?: IConfigCss[];
  modules: {
    base: string;
    modifiers: string[];
  };
  mediasets?: {
    tv: string;
    radio: string;
  };
  logging?: {
    level: string;
    strategy?: string;
  };
  input: {
    map: {
      [key: string]: any;
    };
  };
  streaming?: {
    video?: {
      mediaURIFormat: string;
      supported: ISupportedVideoStreaming[];
    };
    audio?: {
      mediaURIFormat: string;
      supported: ISupportedAudioStreaming[];
    };
  };
  accessibility?: {
    captions: {
      supported: string[];
    };
  };
  layouts?: ILayout[];
  networking: { supportsJSONP: boolean };
  capabilities: string[];
  statLabels: {
    deviceType?: string;
    serviceType?: string;
    browserType?: string;
  };
  widgets?: {
    componentcontainer?: {
      fade?: boolean;
    };
  };
}

export interface ISupportedVideoStreaming {
  protocols: string[];
  encodings: string[];
  transferFormat: string[];
  maximumBitRate: number;
  maximumVideoLines: number;
}

export interface ISupportedAudioStreaming {
  protocols: string[];
  encodings: string[];
  maximumBitRate: number;
}

export interface IAnimOptions {
  el: Node;
  to?: {
    left?: number;
    right?: number;
  };
  skipAnim?: boolean;
  onComplete?: () => void;
  fps?: number;
  duration?: number;
  easing?: string;
}

export interface ILoggingMethods {
  log: (message?: any, ...optionalParams: any[]) => void;
  debug: (message?: any, ...optionalParams: any[]) => void;
  info: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
}

export interface IDeviceCallbacks {
  onSuccess(deviceClass: Device): void;
  onError(ex: any): void;
}

export interface IShowElementOptions extends IShowOptions {
  el: Node;
}

export interface IDevice {
  setApplication(app: Application): void;
  getTopLevelElement(): Node;
  preloadImage(url: string): void;
  getCurrentRoute(): string[];
  appendChildElement(to: Node, el: Node): void;
  setElementClasses(el: Node, classNames: string[]): void;
  removeClassFromElement(el: Node, className: string, deep?: boolean): void;
  addClassToElement(el: Node, className: string): void;
  addKeyEventListener(): void;
  getChildElementsByTagName(el: Node, tagName: string): Node[];
  showElement(options: IShowElementOptions): object;
  loadStyleSheet(url: string, callback: (res?: string) => void): void;
  clearElement(el: HTMLElement): void;
  getConfig(): object;
  getLogger(): ILoggingMethods;
  getKeyMap(): { [key: string]: number };
}

export abstract class Device extends BaseClass implements IDevice {
  public static load(config: IDeviceConfig, callbacks: IDeviceCallbacks) {
    try {
      requirejs([config.modules.base].concat(config.modules.modifiers), object => {
        const deviceClassConstructor: new (config: IDeviceConfig) => Device = object[Object.keys(object)[0]];
        try {
          callbacks.onSuccess(new deviceClassConstructor(config));
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

  public static addLoggingMethod(moduleId: string, loggingMethods: object) {
    this.loggingStrategies[moduleId] = loggingMethods;
  }

  private static loggingStrategies: { [key: string]: object } = {};
  private static filteredLoggingMethods: ILoggingMethods = null;

  protected application: Application;

  private config: IDeviceConfig;
  private keyMap: { [key: string]: number };

  constructor(config: IDeviceConfig) {
    super();

    this.application = null;
    this.config = config;
    this.keyMap = {};

    // Manipulate the input map into a mapping between key event keycodes and
    // our virtual key codes
    if (config.input && config.input.map) {
      const symbolMap = {
        UP: KeyEvent.VK_UP,
        DOWN: KeyEvent.VK_DOWN,
        LEFT: KeyEvent.VK_LEFT,
        RIGHT: KeyEvent.VK_RIGHT,
        ENTER: KeyEvent.VK_ENTER,
        BACK: KeyEvent.VK_BACK,
        SPACE: KeyEvent.VK_SPACE,
        BACK_SPACE: KeyEvent.VK_BACK_SPACE,
        PLAY: KeyEvent.VK_PLAY,
        PAUSE: KeyEvent.VK_PAUSE,
        PLAY_PAUSE: KeyEvent.VK_PLAY_PAUSE,
        STOP: KeyEvent.VK_STOP,
        PREV: KeyEvent.VK_PREV,
        NEXT: KeyEvent.VK_NEXT,
        FAST_FWD: KeyEvent.VK_FAST_FWD,
        REWIND: KeyEvent.VK_REWIND,
        SUBTITLE: KeyEvent.VK_SUBTITLE,
        INFO: KeyEvent.VK_INFO,
        VOLUME_UP: KeyEvent.VK_VOLUME_UP,
        VOLUME_DOWN: KeyEvent.VK_VOLUME_DOWN,
        MUTE: KeyEvent.VK_MUTE,
        RED: KeyEvent.VK_RED,
        GREEN: KeyEvent.VK_GREEN,
        YELLOW: KeyEvent.VK_YELLOW,
        BLUE: KeyEvent.VK_BLUE,
        HELP: KeyEvent.VK_HELP,
        SEARCH: KeyEvent.VK_SEARCH,
        AD: KeyEvent.VK_AUDIODESCRIPTION,
        HD: KeyEvent.VK_HD,
        A: KeyEvent.VK_A,
        B: KeyEvent.VK_B,
        C: KeyEvent.VK_C,
        D: KeyEvent.VK_D,
        E: KeyEvent.VK_E,
        F: KeyEvent.VK_F,
        G: KeyEvent.VK_G,
        H: KeyEvent.VK_H,
        I: KeyEvent.VK_I,
        J: KeyEvent.VK_J,
        K: KeyEvent.VK_K,
        L: KeyEvent.VK_L,
        M: KeyEvent.VK_M,
        N: KeyEvent.VK_N,
        O: KeyEvent.VK_O,
        P: KeyEvent.VK_P,
        Q: KeyEvent.VK_Q,
        R: KeyEvent.VK_R,
        S: KeyEvent.VK_S,
        T: KeyEvent.VK_T,
        U: KeyEvent.VK_U,
        V: KeyEvent.VK_V,
        W: KeyEvent.VK_W,
        X: KeyEvent.VK_X,
        Y: KeyEvent.VK_Y,
        Z: KeyEvent.VK_Z,
        '0': KeyEvent.VK_0,
        '1': KeyEvent.VK_1,
        '2': KeyEvent.VK_2,
        '3': KeyEvent.VK_3,
        '4': KeyEvent.VK_4,
        '5': KeyEvent.VK_5,
        '6': KeyEvent.VK_6,
        '7': KeyEvent.VK_7,
        '8': KeyEvent.VK_8,
        '9': KeyEvent.VK_9
      };

      for (const code in config.input.map) {
        if (config.input.map.hasOwnProperty(code)) {
          switch (code) {
            case 'alpha':
              const A: number = config.input.map[code][0];
              const Z: number = config.input.map[code][1];
              const AcharCode = 'A'.charCodeAt(0);
              for (let kc = A; kc <= Z; kc++) {
                this.keyMap[kc.toString()] = symbolMap[String.fromCharCode(kc - A + AcharCode)];
              }
              break;
            case 'numeric':
              const zero: number = config.input.map[code][0];
              const nine: number = config.input.map[code][1];
              const zeroCharCode = '0'.charCodeAt(0);
              for (let kc = zero; kc <= nine; kc++) {
                this.keyMap[kc.toString()] = symbolMap[String.fromCharCode(kc - zero + zeroCharCode)];
              }
              break;
            default:
              const symbol: string = config.input.map[code];
              if (symbol) {
                this.keyMap[code.toString()] = symbolMap[symbol];
              }
              break;
          }
        }
      }

      const ignore = () => {
        //
      };

      const ignoreLoggingMethods: ILoggingMethods = {
        log: ignore,
        debug: ignore,
        info: ignore,
        warn: ignore,
        error: ignore
      };

      // support functions for the above
      const selectLoggingStrategy = (deviceConfig: IDeviceConfig, loggingStrategies) => {
        if (deviceConfig.logging && deviceConfig.logging.strategy) {
          const configuredLoggingStrategy = `antie/devices/logging/${deviceConfig.logging.strategy}`;

          if (loggingStrategies[configuredLoggingStrategy]) {
            return loggingStrategies[configuredLoggingStrategy];
          }
        }

        // no logging methods set - use default logging
        let selectedLoggingStrategy = loggingStrategies['antie/devices/logging/default'];

        if (!selectedLoggingStrategy) {
          selectedLoggingStrategy = loggingStrategies['antie/devices/logging/onscreen'];
        }

        // still no available logging method - default to ignore
        if (!selectedLoggingStrategy) {
          selectedLoggingStrategy = ignoreLoggingMethods;
        }
        return selectedLoggingStrategy;
      };

      const filterLoggingMethods = (deviceConfig: IDeviceConfig, loggingMethods: ILoggingMethods): ILoggingMethods => {
        const filteredLogging = ignoreLoggingMethods;

        if (deviceConfig.logging && deviceConfig.logging.level) {
          const level = deviceConfig.logging.level;
          switch (level) {
            case 'all':
            case 'debug':
              filteredLogging.debug = loggingMethods.debug;
            case 'info':
              filteredLogging.info = loggingMethods.info;
              filteredLogging.log = loggingMethods.log;
            case 'warn':
              filteredLogging.warn = loggingMethods.warn;
            case 'error':
              filteredLogging.error = loggingMethods.error;
          }
        }
        return filteredLogging;
      };

      Device.filteredLoggingMethods = filterLoggingMethods(
        config,
        selectLoggingStrategy(config, Device.loggingStrategies)
      );
    }
  }

  public setApplication(app: Application) {
    this.application = app;
  }

  public getConfig() {
    return this.config;
  }

  public getLogger() {
    return Device.filteredLoggingMethods;
  }

  public getKeyMap() {
    return this.keyMap;
  }

  public abstract preloadImage(url: string): void;

  public abstract getCurrentRoute(): string[];

  public abstract appendChildElement(to: Node, el: Node): void;

  public abstract setElementClasses(el: Node, classNames: string[]): void;

  public abstract removeClassFromElement(el: Node, className: string, deep?: boolean): void;

  public abstract addClassToElement(el: Node, className: string);

  /**
   * Adds global key event listener(s) to the user-agent.
   * This must be added in a way that all key events within the user-agent
   * cause self._application.bubbleEvent(...) to be called with a {@link KeyEvent}
   * object with the mapped keyCode.
   *
   * @example
   * document.onkeydown = function(e) {
   *     self._application.bubbleEvent(new KeyEvent('keydown', keyMap[e.keyCode]));
   * };
   */
  public abstract addKeyEventListener();

  public abstract getChildElementsByTagName(el: Node, tagName: string): Node[];

  public abstract getTopLevelElement(): Node;

  public abstract getStylesheetElements(): Node[];

  public abstract getElementOffset(el: HTMLElement): { top: number; left: number };

  public abstract getElementSize(el: HTMLElement): { width: number; height: number };

  public abstract setElementSize(el: HTMLElement, size: { width?: number; height?: number }): void;

  public abstract setElementContent(el: HTMLElement, content: string, enableHTML?: boolean): void;

  public abstract scrollElementTo(options: IAnimOptions);

  public abstract moveElementTo(options: IAnimOptions);

  public abstract hideElement(options: IAnimOptions);

  public abstract showElement(options: IAnimOptions);

  public abstract tweenElementStyle(options: IAnimOptions); // TODO: check options

  public abstract stopAnimation(anim: object); // TODO: implement anim interface

  public abstract loadStyleSheet(url: string, callback?: (res: string) => void): void;

  /**
   * Clears the content of an element.
   * @param el The element you are removing the content from.
   */
  public abstract clearElement(el: HTMLElement): void;

  public abstract createContainer(id?: string, classNames?: string[]): HTMLElement;

  public abstract createLabel(id?: string, classNames?: string[], text?: string, enableHTML?: boolean): HTMLElement;

  /**
   * @deprecated
   */
  public abstract getTextHeight(text: string, maxWidth: number, classNames: string[]): number;

  public abstract createButton(id?: string, classNames?: string[]): HTMLElement;

  public abstract createList(id?: string, classNames?: string[]): Node;

  public abstract createListItem(id?: string, classNames?: string[]): Node;

  public abstract createImage(
    src: string,
    id?: string,
    classNames?: string[],
    size?: { width?: number; height?: number },
    onLoad?: (...args: any[]) => void,
    onError?: (...args: any[]) => void
  ): Node;

  public abstract removeElement(el: HTMLElement): void;
}
