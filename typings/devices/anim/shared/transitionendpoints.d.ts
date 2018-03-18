import { IAnimOptions } from '../../base/device';
export declare class TransitionEndPoints {
    static defaultUnits: {
        top: string;
        left: string;
        bottom: string;
        right: string;
        width: string;
        height: string;
    };
    private from;
    private to;
    private onComplete;
    private onStart;
    private units;
    private skipAnim;
    /**
     * A class to store information about the end points of a specific transition:
     * The start and end values of properties plus and any associated callbacks.
     */
    constructor(options?: IAnimOptions);
    setFromOptions(options: IAnimOptions): void;
    addUnitsToPropertyValue(property: string, value: number, unit?: string): string;
    hasProperty(property: any): boolean;
    getProperties(): string[];
    getPropertyDestination(prop: any): number;
    getPropertyOrigin(prop: any): number;
    getOnCompleteCallback(): () => void;
    shouldSkip(): boolean;
    toAndFromAllEqual(): boolean;
    completeOriginsUsingElement(el: any): void;
    private addValuesToFrom(property, options);
}
