import { IAnimator, IAnimOptions } from '../../base/device';
import { Translate } from './translate';
import { Tween } from './tween';

export const getAnimator = (options: IAnimOptions): IAnimator => {
  if (options.to.left !== undefined) {
    return Translate(options, options.to.left, 'left');
  }
  if (options.to.top !== undefined) {
    return Translate(options, options.to.top, 'top');
  }
  return Tween(options);
};
