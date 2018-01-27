import { Historian } from '../historian';
import { Device, IDevice } from './device';

export class BrowserDevice extends Device implements IDevice {
  public addKeyEventListener() {
    // var self = this;
    // var _keyMap = this.getKeyMap();
    // var _pressed = {};
    // // We need to normalise these events on so that for every key pressed there's
    // // one keydown event, followed by multiple keypress events whilst the key is
    // // held down, followed by a single keyup event.
    // document.onkeydown = function(e) {
    //   e = e || window.event;
    //   var _keyCode = _keyMap[e.keyCode.toString()];
    //   if (_keyCode) {
    //     if (!_pressed[e.keyCode.toString()]) {
    //       self._application.bubbleEvent(new KeyEvent('keydown', _keyCode));
    //       _pressed[e.keyCode.toString()] = true;
    //     } else {
    //       self._application.bubbleEvent(new KeyEvent('keypress', _keyCode));
    //     }
    //     e.preventDefault();
    //   }
    // };
    // document.onkeyup = function(e) {
    //   e = e || window.event;
    //   var _keyCode = _keyMap[e.keyCode.toString()];
    //   if (_keyCode) {
    //     delete _pressed[e.keyCode.toString()];
    //     self._application.bubbleEvent(new KeyEvent('keyup', _keyCode));
    //     e.preventDefault();
    //   }
    // };
    // document.onkeypress = function(e) {
    //   e = e || window.event;
    //   var _keyCode = _keyMap[e.keyCode.toString()];
    //   if (_keyCode) {
    //     self._application.bubbleEvent(new KeyEvent('keypress', _keyCode));
    //     e.preventDefault();
    //   }
    // };
  }

  public getTopLevelElement() {
    return document.documentElement || document.body.parentNode || document;
  }

  public addClassToElement(el: Element, className: string): void {
    // this.removeClassFromElement(el, className, false);
    // el.className = this.trim(`${el.className} ${className}`);
  }

  public preloadImage(url: string): void {
    const img = new Image();
    img.src = url;
  }

  public loadStyleSheet(url: string, callback?: (res: string) => void): void {
    // var self = this;
    // function supportsCssRules() {
    //   var style = self._createElement('style');
    //   style.type = 'text/css';
    //   style.innerHTML = 'body {};';
    //   style.className = 'added-by-antie';
    //   document.getElementsByTagName('head')[0].appendChild(style);
    //   try {
    //     style.sheet.cssRules;
    //     return true;
    //   } catch (e) {
    //   } finally {
    //     style.parentNode.removeChild(style);
    //   }
    //   return false;
    // }
    // if (callback && supportsCssRules()) {
    //   var style = this._createElement('style');
    //   style.type = 'text/css';
    //   style.innerHTML = "@import url('" + url + "');";
    //   style.className = 'added-by-antie';
    //   document.getElementsByTagName('head')[0].appendChild(style);
    //   var interval = window.setInterval(function() {
    //     try {
    //       style.sheet.cssRules;
    //       window.clearInterval(interval);
    //     } catch (ex) {
    //       return;
    //     }
    //     callback(url);
    //   }, 200);
    // } else {
    //   var link = this._createElement('link');
    //   link.type = 'text/css';
    //   link.rel = 'stylesheet';
    //   link.href = url;
    //   link.className = 'added-by-antie';
    //   document.getElementsByTagName('head')[0].appendChild(link);
    //   // Onload trickery from:
    //   // http://www.backalleycoder.com/2011/03/20/link-tag-css-stylesheet-load-event/
    //   if (callback) {
    //     var img = this._createElement('img');
    //     var done = function() {
    //       img.onerror = function() {};
    //       callback(url);
    //       img.parentNode.removeChild(img);
    //     };
    //     img.onerror = done;
    //     this.getTopLevelElement().appendChild(img);
    //     img.src = url;
    //   }
    // }
    // return style;
  }

  public getCurrentRoute() {
    const unescaped = decodeURI(window.location.hash).split(Historian.HISTORY_TOKEN, 1)[0];
    return unescaped.replace(/^#/, '').split('/');
  }

  public setElementClasses(el: Element, classNames: string[]) {
    el.className = classNames.join(' ');
  }

  private trim(str: string): string {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  }
}
