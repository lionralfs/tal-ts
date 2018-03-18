import { Device, IAnimator, IAnimOptions } from '../base/device';
export declare const movesScroll: (self: Device, startLeft: number, startTop: number, changeLeft: number, changeTop: number, options: IAnimOptions) => IAnimator;
export declare const scrollElementTo: (self: Device, options: IAnimOptions) => IAnimator;
export declare const moveElementTo: (self: Device, options: IAnimOptions) => IAnimator;
export declare const hideElement: (self: Device, options: IAnimOptions) => IAnimator;
export declare const showElement: (self: Device, options: IAnimOptions) => IAnimator;
export declare const tweenElementStyle: (self: Device, options: IAnimOptions) => IAnimator;
export declare const stopAnimation: (anim: any) => void;
export declare const isAnimationDisabled: () => boolean;
