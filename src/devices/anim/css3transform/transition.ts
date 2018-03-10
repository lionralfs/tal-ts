import { IAnimOptions } from '../../device';
import { EasingLookup } from '../css3/easinglookup';
import { Helpers } from '../shared/helpers';

const getEasing = (options: IAnimOptions) => {
  const easing = options.easing || 'easeFromTo';
  return EasingLookup[easing];
};

const set = (el: HTMLElement, properties: string[], options: IAnimOptions) => {
  const duration = (options.duration || 840) + 'ms ';
  const easing = getEasing(options);
  const transitions = properties.map(property => `${property} ${duration}${easing}`).join(',');
  Helpers.setStyle(el, 'transition', transitions, true);
};

const clear = (el: HTMLElement) => {
  Helpers.setStyle(el, 'transition', '', true);
};

export const Transition = {
  set,
  clear
};
