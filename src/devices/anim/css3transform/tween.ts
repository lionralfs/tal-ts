import { IAnimator, IAnimOptions } from '../../base/device';
import { Helpers } from '../shared/helpers';
import { Transition } from './transition';

export const Tween = (options: IAnimOptions): IAnimator => {
  let onTransitionEnd;
  const el = options.el;
  const whitelistWithDefaultUnits = {
    width: 'px',
    height: 'px',
    opacity: ''
  };

  const start = () => {
    const triggerReflowFor = (element: HTMLElement) => {
      // tslint:disable-next-line
      element.offsetHeight;
    };

    const filterDimensionKeys = (dimensions: IAnimOptions['to']): string[] => {
      dimensions = dimensions || {};
      return Object.keys(dimensions).filter(dimension => whitelistWithDefaultUnits[dimension] !== undefined);
    };

    const setDimensions = (dimensions: IAnimOptions['to'], units: IAnimOptions['units']) => {
      units = units || {};
      const filteredDimensionKeys = filterDimensionKeys(dimensions);

      filteredDimensionKeys.forEach(key => {
        const unit = units[key] || whitelistWithDefaultUnits[key];
        Helpers.setStyle(el, key, `${dimensions[key]}${unit}`);
      });
      return filteredDimensionKeys.length > 0;
    };

    function onComplete() {
      Transition.clear(el);
      if (options.onComplete) {
        options.onComplete();
      }
    }

    if (Helpers.skipAnim(options)) {
      setDimensions(options.to, options.units);
      onComplete();
      return;
    }

    if (setDimensions(options.from, options.units)) {
      triggerReflowFor(el);
    }

    onTransitionEnd = Helpers.registerTransitionEndEvent(el, onComplete);
    Transition.set(el, filterDimensionKeys(options.to), options);
    setDimensions(options.to, options.units);
  };

  function stop() {
    onTransitionEnd();
  }

  return {
    start,
    stop
  };
};
