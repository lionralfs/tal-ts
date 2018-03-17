import { IAnimOptions } from '../../base/device';
export declare const Helpers: {
    setStyle: (el: HTMLElement, prop: string, val: string, prefixed?: boolean) => void;
    skipAnim: (options: IAnimOptions) => boolean;
    registerTransitionEndEvent: (el: HTMLElement, callback: () => void) => (evt: any) => void;
};
