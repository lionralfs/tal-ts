import { IAnimator, IAnimOptions } from '../base/device';
export declare const scrollElementTo: (options: IAnimOptions) => IAnimator;
export declare const moveElementTo: (options: IAnimOptions) => IAnimator;
export declare const hideElement: (options: IAnimOptions) => IAnimator;
export declare const showElement: (options: IAnimOptions) => IAnimator;
export declare const tweenElementStyle: (options: IAnimOptions) => IAnimator;
export declare const stopAnimation: (animator: IAnimator) => void;
export declare const isAnimationDisabled: () => boolean;
