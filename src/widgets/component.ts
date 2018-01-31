import { IDeviceConfig } from '../devices/device';
import { RuntimeContext } from '../runtimecontext';
import { IHistoryItem } from './componentcontainer';
import { Container } from './container';

export interface IComponent {
  hide(): void;
  getCurrentState(): IHistoryItem;
  getIsModal(): boolean;
  getConfig(): IDeviceConfig;
  isComponent(): boolean;
}

export class Component extends Container implements IComponent {
  private isModal: boolean;

  constructor(id?: string) {
    super(id);

    this.addClass('component');
    this.isModal = false;
  }

  public hide() {
    if (this.parentWidget) {
      this.parentWidget.hide();
    }
  }

  public getCurrentState() {
    return null;
  }

  public getIsModal() {
    return this.isModal;
  }

  public getConfig() {
    return RuntimeContext.getDevice().getConfig();
  }

  public isComponent() {
    return true;
  }
}
