import { BaseClass } from '../../../class';

export abstract class Orientation extends BaseClass {
  public abstract dimension(): number;

  public abstract edge(): string;

  public abstract styleClass(): string;

  public abstract defaultKeys(): {
    PREVIOUS: number;
    NEXT: number;
  };
}
