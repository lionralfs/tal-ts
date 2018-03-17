import { BrowserDevice } from './base/browserdevice';
import { HTML5MediaPlayer } from './mediaplayer/html5';
import { isAnimationDisabled, stopAnimation, tweenElementStyle } from './anim/styletopleft';
import { IAnimator, IAnimOptions } from './base/device';

export class WebkitDevice extends BrowserDevice {
  protected mediaPlayer = new HTML5MediaPlayer();

  public scrollElementTo() {}

  public moveElementTo() {}

  public hideElement() {}

  public showElement() {}

  public tweenElementStyle(options: IAnimOptions): IAnimator {
    return tweenElementStyle(this, options);
  }

  public stopAnimation(animator: IAnimator): void {
    stopAnimation(animator);
  }

  public isAnimationDisabled(): boolean {
    return isAnimationDisabled();
  }
}
