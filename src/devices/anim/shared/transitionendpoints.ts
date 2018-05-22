import { IAnimOptions } from '../../base/device';

export class TransitionEndPoints {
  public static defaultUnits = {
    top: 'px',
    left: 'px',
    bottom: 'px',
    right: 'px',
    width: 'px',
    height: 'px'
  };

  private from: IAnimOptions['from'];
  private to: IAnimOptions['to'];
  private onComplete: () => void;
  private onStart: () => void;
  private units: IAnimOptions['units'];
  private skipAnim: boolean;

  /**
   * A class to store information about the end points of a specific transition:
   * The start and end values of properties plus and any associated callbacks.
   */
  constructor(options?: IAnimOptions) {
    this.from = {};
    this.to = {};
    this.onComplete = () => {
      //
    };
    if (options) {
      this.setFromOptions(options);
    }
  }

  public setFromOptions(options: IAnimOptions): void {
    this.units = options.units || {};
    this.skipAnim = options.skipAnim;
    for (const property in options.to) {
      if (options.to.hasOwnProperty(property)) {
        this.to[property] = this.addUnitsToPropertyValue(property, options.to[property]);
        this.addValuesToFrom(property, options);
      }
    }
    this.onComplete = options.onComplete || this.onComplete;
    this.onStart = options.onStart || this.onStart;
  }

  public addUnitsToPropertyValue(property: string, value: number, unit?: string): string {
    const newUnit: string = unit || this.units[property] || TransitionEndPoints.defaultUnits[property];
    if (newUnit !== undefined) {
      return value + newUnit;
    }
    return value.toString();
  }

  public hasProperty(property): boolean {
    return this.to.hasOwnProperty(property);
  }

  public getProperties(): string[] {
    const propArray: string[] = [];
    for (const prop in this.to) {
      if (this.to.hasOwnProperty(prop)) {
        propArray.push(prop);
      }
    }
    return propArray;
  }

  public getPropertyDestination(prop): number {
    if (this.to.hasOwnProperty(prop)) {
      return this.to[prop];
    }
    return undefined;
  }

  public getPropertyOrigin(prop): number {
    if (this.from.hasOwnProperty(prop)) {
      return this.from[prop];
    }
    return undefined;
  }

  public getOnCompleteCallback(): () => void {
    return this.onComplete;
  }

  public shouldSkip(): boolean {
    return !!this.skipAnim || this.toAndFromAllEqual();
  }

  public toAndFromAllEqual(): boolean {
    let equal = true;

    for (const prop in this.to) {
      if (this.to.hasOwnProperty(prop)) {
        equal = this.from && this.from.hasOwnProperty(prop) ? equal && this.to[prop] === this.from[prop] : false;
      }
    }
    return equal;
  }

  public completeOriginsUsingElement(el): void {
    const shouldReplace = (elementValue, property: string): boolean => {
      return elementValue !== null && elementValue !== undefined && this.from[property] === undefined;
    };

    for (const property in this.to) {
      if (this.to.hasOwnProperty(property)) {
        const elementValue = el.style.getPropertyValue(property);
        if (shouldReplace(elementValue, property)) {
          this.from[property] = elementValue;
        }
      }
    }
  }

  private addValuesToFrom(property, options): void {
    if (options.from && options.from.hasOwnProperty(property)) {
      this.from[property] = this.addUnitsToPropertyValue(property, options.from[property]);
    }
  }
}
