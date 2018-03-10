import { RuntimeContext } from '../../../runtimecontext';
import { IAnimOptions } from '../../device';

const VENDOR_PREFIXES: string[] = ['-webkit-', '-moz-', '-o-'];
const TRANSITION_END_EVENTS: string[] = ['webkitTransitionEnd', 'oTransitionEnd', 'otransitionend', 'transitionend'];

const setStyle = (el: HTMLElement, prop: string, val: string, prefixed?: boolean): void => {
  if (prefixed) {
    for (let i = 0, len = VENDOR_PREFIXES.length; i < len; i++) {
      const prefix = VENDOR_PREFIXES[i];
      el.style.setProperty(prefix + prop, val.replace('transform', `${prefix}transform`));
    }
  }
  el.style.setProperty(prop, val);
};

const skipAnim = (options: IAnimOptions): boolean => {
  return options.skipAnim || RuntimeContext.getDevice().getConfig().animationDisabled;
};

const addTransitionEvent = (el: HTMLElement, callback: (args?: any) => void) => {
  for (let i = 0, len = TRANSITION_END_EVENTS.length; i < len; i++) {
    el.addEventListener(TRANSITION_END_EVENTS[i], callback);
  }
};

const removeTransitionEvent = (el: HTMLElement, callback: (args?: any) => void) => {
  for (let i = 0, len = TRANSITION_END_EVENTS.length; i < len; i++) {
    el.removeEventListener(TRANSITION_END_EVENTS[i], callback);
  }
};

const registerTransitionEndEvent = (el: HTMLElement, callback: () => void) => {
  const onComplete = evt => {
    if (!evt || evt.target === el) {
      removeTransitionEvent(el, onComplete);
      callback();
    }
  };
  addTransitionEvent(el, onComplete);
  return onComplete;
};

export const Helpers = {
  setStyle,
  skipAnim,
  registerTransitionEndEvent
};
