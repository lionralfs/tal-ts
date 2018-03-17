import { IDeviceConfig } from '../devices/base/device';
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

  public hide(): void {
    if (this.parentWidget) {
      this.parentWidget.hide();
    }
  }

  public getCurrentState(): IHistoryItem {
    return null;
  }

  public getIsModal(): boolean {
    return this.isModal;
  }

  public getConfig(): IDeviceConfig {
    return RuntimeContext.getDevice().getConfig();
  }

  public isComponent(): boolean {
    return true;
  }
}
