import {
  hideElement,
  isAnimationDisabled,
  moveElementTo,
  scrollElementTo,
  showElement,
  stopAnimation,
  tweenElementStyle
} from './anim/css3transform';
import { BrowserDevice } from './base/browserdevice';
import { IAnimator, IAnimOptions } from './base/device';
import { HTML5MediaPlayer } from './mediaplayer/html5';

export class WebkitDevice extends BrowserDevice {
  protected mediaPlayer = new HTML5MediaPlayer();

  public scrollElementTo(options: IAnimOptions): IAnimator {
    // return scrollElementTo(this, options);
    return scrollElementTo(options);
  }

  public moveElementTo(options: IAnimOptions): IAnimator {
    // return moveElementTo(this, options);
    return moveElementTo(options);
  }

  public hideElement(options: IAnimOptions): IAnimator {
    // return hideElement(this, options);
    return hideElement(options);
  }

  public showElement(options: IAnimOptions): IAnimator {
    // return showElement(this, { ...options, skipAnim: true });
    return showElement(options);
  }

  public tweenElementStyle(options: IAnimOptions): IAnimator {
    // return tweenElementStyle(this, options);
    return tweenElementStyle(options);
  }

  public stopAnimation(animator: IAnimator): void {
    stopAnimation(animator);
  }

  public isAnimationDisabled(): boolean {
    return isAnimationDisabled();
  }
}
