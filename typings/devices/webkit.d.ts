import { BrowserDevice } from './base/browserdevice';
import { IAnimator, IAnimOptions } from './base/device';
import { HTML5MediaPlayer } from './mediaplayer/html5';
export declare class WebkitDevice extends BrowserDevice {
    protected mediaPlayer: HTML5MediaPlayer;
    scrollElementTo(options: IAnimOptions): IAnimator;
    moveElementTo(options: IAnimOptions): IAnimator;
    hideElement(options: IAnimOptions): IAnimator;
    showElement(options: IAnimOptions): IAnimator;
    tweenElementStyle(options: IAnimOptions): IAnimator;
    stopAnimation(animator: IAnimator): void;
    isAnimationDisabled(): boolean;
}
