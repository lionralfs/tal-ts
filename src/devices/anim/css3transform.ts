import { IAnimator, IAnimOptions } from '../base/device';
import { getAnimator } from './css3transform/animationfactory';

export const scrollElementTo = (options: IAnimOptions): IAnimator => {
  if (!(/_mask$/.test(options.el.id) && options.el.childNodes.length > 0)) {
    return null;
  }

  options.el = options.el.childNodes[0] as HTMLElement;

  if (options.to.top) {
    // options.to.top = parseInt(options.to.top, 10) * -1;
    options.to.top *= -1;
  }
  if (options.to.left) {
    // options.to.left = parseInt(options.to.left, 10) * -1;
    options.to.left *= -1;
  }

  const animator = getAnimator(options);
  animator.start();
  return options.skipAnim ? null : animator;
};

export const moveElementTo = (options: IAnimOptions): IAnimator => {
  const animator = getAnimator(options);
  animator.start();
  return options.skipAnim ? null : animator;
};

export const hideElement = (options: IAnimOptions): IAnimator => {
  const onComplete = () => {
    options.el.style.visibility = 'hidden';
    if (options.onComplete) {
      options.onComplete();
    }
  };

  const fadeOptions: IAnimOptions = {
    el: options.el,
    to: {
      opacity: 0
    },
    duration: options.duration,
    easing: options.easing || 'linear',
    onComplete,
    skipAnim: options.skipAnim
  };

  return tweenElementStyle(fadeOptions);
};

export const showElement = (options: IAnimOptions): IAnimator => {
  const fadeOptions: IAnimOptions = {
    el: options.el,
    to: {
      opacity: 1
    },
    from: {
      opacity: 0
    },
    duration: options.duration,
    easing: options.easing || 'linear',
    onComplete: options.onComplete,
    skipAnim: options.skipAnim
  };

  options.el.style.visibility = 'visible';
  return tweenElementStyle(fadeOptions);
};

export const tweenElementStyle = (options: IAnimOptions): IAnimator => {
  const animator = getAnimator(options);
  if (!animator) {
    return;
  }
  animator.start();
  return options.skipAnim ? null : animator;
};

export const stopAnimation = (animator: IAnimator): void => {
  if (animator) {
    animator.stop();
  }
};

export const isAnimationDisabled = (): boolean => {
  return false;
};
