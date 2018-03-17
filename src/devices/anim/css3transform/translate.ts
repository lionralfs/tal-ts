import { IAnimator, IAnimOptions } from '../../base/device';
import { Helpers } from '../shared/helpers';
import { Transition } from './transition';

export const Translate = (options: IAnimOptions, position: number, property: 'left' | 'top'): IAnimator => {
  const el = options.el;
  let onTransitionEnd: (args?: any) => void;
  let cancelledAnimation;

  const propertyTranslateMap = {
    left: 'translate3d({x}px, 0, 0)',
    top: 'translate3d(0, {x}px, 0)'
  };

  const getStyle = (): number => {
    const value = parseInt(el.style[property], 10);
    return value || 0;
  };

  const transform = () => {
    const distance = position - getStyle();
    const translate3d = propertyTranslateMap[property].replace('{x}', distance.toString());
    Transition.set(el, ['transform'], options);
    Helpers.setStyle(el, 'transform', translate3d, true);
  };

  const endTransform = () => {
    Transition.clear(el);

    if (!cancelledAnimation) {
      Helpers.setStyle(el, 'transform', '', true);
      Helpers.setStyle(el, property, position + 'px', false);
    }

    if (options.onComplete) {
      options.onComplete();
    }
  };

  const start = () => {
    if (Helpers.skipAnim(options)) {
      endTransform();
      return;
    }

    onTransitionEnd = Helpers.registerTransitionEndEvent(el, endTransform);
    transform();
  };

  const stop = () => {
    cancelledAnimation = true;
    onTransitionEnd();
  };

  return {
    start,
    stop
  };
};
