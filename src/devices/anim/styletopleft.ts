import { Device, IAnimator, IAnimOptions } from '../base/device';
import { TransitionEndPoints } from './shared/transitionendpoints';
import { tween } from './tween';

export const movesScroll = (
  self: Device,
  startLeft: number,
  startTop: number,
  changeLeft: number,
  changeTop: number,
  options: IAnimOptions
) => {
  if (changeLeft === 0 && changeTop === 0) {
    if (options.onComplete) {
      options.onComplete();
    }
    return null;
  }

  if (this.getConfig().animationDisabled || options.skipAnim) {
    if (options.to.left !== undefined) {
      options.el.style.left = options.to.left + 'px';
    }
    if (options.to.top !== undefined) {
      options.el.style.top = options.to.top + 'px';
    }

    if (options.onComplete) {
      options.onComplete();
    }
    return null;
  } else {
    const from: any = {};
    if (startTop !== undefined) {
      from.top = startTop + 'px';
    }
    if (startLeft !== undefined) {
      from.left = startLeft + 'px';
    }

    const to: any = {};
    if (options.to.top !== undefined) {
      to.top = options.to.top + 'px';
    }
    if (options.to.left !== undefined) {
      to.left = options.to.left + 'px';
    }

    return tween(self, {
      el: options.el,
      style: options.el.style,
      from,
      to,
      offset: options.offset || 0,
      easing: options.easing,
      fps: options.fps,
      duration: options.duration,
      onComplete: options.onComplete
    });
  }
};

export const scrollElementTo = (options: IAnimOptions): IAnimator => {
  // Helper function to return an object that inherits from the original
  function inherit<T>(original: T): T {
    function Inherited(): void {
      //
    }

    Inherited.prototype = original;
    return new Inherited();
  }

  // Make a new modifiable options object inheriting from the original. Need to do this rather than
  // simply reverting any changes before returning, as the tweening library calls onComplete() which
  // may require an unchanged object.
  const newOptions: IAnimOptions = inherit(options);
  if (options.to) {
    newOptions.to = inherit(options.to);
  }

  // Check validity of call and use child element as the real target
  if (new RegExp('_mask$').test(options.el.id)) {
    if (options.el.childNodes.length === 0) {
      return null;
    }
    options.el.style.position = 'relative';
    newOptions.el = options.el.childNodes[0] as HTMLElement;
    newOptions.el.style.position = 'relative';
  } else {
    return null;
  }

  // Make a copy of the 'to' property, with the sign of the 'top' and 'left' properties flipped.
  if (options.to && options.to.left) {
    newOptions.to.left = -options.to.left;
  }
  if (options.to && options.to.top) {
    newOptions.to.top = -options.to.top;
  }

  const startLeft = parseInt(newOptions.el.style.left.replace(/px/, ''), 10) || 0;
  const changeLeft = options.to.left !== undefined ? options.to.left - Math.abs(startLeft) : 0;
  const startTop = parseInt(newOptions.el.style.top.replace(/px/, ''), 10) || 0;
  const changeTop = options.to.top !== undefined ? options.to.top - Math.abs(startTop) : 0;

  return movesScroll.apply(this, [startLeft, startTop, changeLeft, changeTop, newOptions]);
};

export const moveElementTo = (options: IAnimOptions): IAnimator => {
  // Performance consideration: if left or top is null they are ignored to prevent the additional
  // work animating them.

  const startLeft = parseInt(options.el.style.left.replace(/px|em|pt/, ''), 10) || 0;
  const changeLeft = options.to.left !== undefined ? options.to.left - startLeft : 0;
  const startTop = parseInt(options.el.style.top.replace(/px|em|pt/, ''), 10) || 0;
  const changeTop = options.to.top !== undefined ? options.to.top - startTop : 0;

  return movesScroll.apply(this, [startLeft, startTop, changeLeft, changeTop, options]);
};

export const hideElement = (self: Device, options: IAnimOptions): IAnimator => {
  if (self.getConfig().animationDisabled || options.skipAnim) {
    options.el.style.visibility = 'hidden';
    options.el.style.opacity = '0';
    if (typeof options.onComplete === 'function') {
      options.onComplete();
    }
    return null;
  } else {
    const animationDefaults = (self.getConfig().defaults && self.getConfig().defaults.hideElementFade) || {};
    return tween(self, {
      el: options.el,
      style: options.el.style,
      from: {
        opacity: isNaN(parseInt(options.el.style.opacity, 10)) ? 1 : parseFloat(options.el.style.opacity)
      },
      to: {
        opacity: 0
      },
      fps: options.fps || animationDefaults.fps || 25,
      duration: options.duration || animationDefaults.duration || 840,
      easing: options.easing || animationDefaults.easing || 'linear',
      onComplete: function onComplete(): void {
        options.el.style.visibility = 'hidden';
        if (options.onComplete) {
          options.onComplete();
        }
      }
    });
  }
};

export const showElement = (options: IAnimOptions): IAnimator => {
  if (this.getConfig().animationDisabled || options.skipAnim) {
    options.el.style.visibility = 'visible';
    options.el.style.opacity = '1';
    if (typeof options.onComplete === 'function') {
      options.onComplete();
    }
    return undefined;
  } else {
    const animationDefaults = (this.getConfig().defaults && this.getConfig().defaults.showElementFade) || {};
    return this._tween({
      el: options.el,
      style: options.el.style,
      from: {
        opacity: isNaN(parseInt(options.el.style.opacity, 10)) ? 0 : parseFloat(options.el.style.opacity)
      },
      to: {
        opacity: 1
      },
      fps: options.fps || animationDefaults.fps || 25,
      duration: options.duration || animationDefaults.duration || 840,
      easing: options.easing || animationDefaults.easing || 'linear',
      onComplete: options.onComplete,
      onStart: function onStart(): void {
        options.el.style.visibility = 'visible';
      }
    });
  }
};

export const tweenElementStyle = (self: Device, options: IAnimOptions): IAnimator => {
  const endPoints = new TransitionEndPoints(options);
  endPoints.completeOriginsUsingElement(options.el);

  const fireComplete = () => {
    if (options.onComplete) {
      options.onComplete();
    }
  };

  const skipAnimation = () => {
    const properties = endPoints.getProperties();
    for (let i = 0; i !== properties.length; i += 1) {
      const property = properties[i];
      options.el.style[property] = endPoints.getPropertyDestination(property);
    }
  };

  const getTweenOptions = () => {
    const properties = endPoints.getProperties();
    const tweenOptions = {
      el: options.el,
      style: options.el.style,
      fps: options.el.fps,
      duration: options.duration,
      easing: options.easing,
      onComplete: options.onComplete,
      to: {},
      from: {}
    };

    for (let i = 0; i !== properties.length; i += 1) {
      const property = properties[i];
      tweenOptions.to[property] = endPoints.getPropertyDestination(property);
      tweenOptions.from[property] = endPoints.getPropertyOrigin(property);
    }
    return tweenOptions;
  };

  if (endPoints.toAndFromAllEqual()) {
    fireComplete();
    return null;
  }

  if (options.skipAnim || this.getConfig().animationDisabled) {
    skipAnimation();
    fireComplete();
    return undefined;
  }

  return tween(self, getTweenOptions());
};

export const stopAnimation = anim => {
  anim.stop(true);
};

export const isAnimationDisabled = () => false;
