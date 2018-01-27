import { Container } from './container';

export interface IButton extends Container {}

export class Button extends Container implements IButton {
  constructor(id?: string) {
    super(id);
  }
}
