import { Application } from './application';
import { BaseClass } from './class';
import { Device } from './devices/device';

export interface IRuntimeContext extends BaseClass {
  clearCurrentApplication(): void;
  setCurrentApplication(app: Application): void;
  getCurrentApplication(): object;
  getDevice(): object;
}

export class RuntimeContextClass extends BaseClass implements IRuntimeContext {
  private applicationObject: Application;

  constructor() {
    super();
    console.log('created RuntimeContext');
  }

  public clearCurrentApplication() {
    this.applicationObject = null;
  }

  public setCurrentApplication(app: Application) {
    if (this.applicationObject) {
      throw new Error(
        'RuntimeContext.setCurrentApplication called for a second time. You can only have one application instance running at any time.'
      );
    } else {
      this.applicationObject = app;
    }
  }

  public getCurrentApplication() {
    return this.applicationObject;
  }

  public getDevice(): Device {
    return this.getCurrentApplication().getDevice();
  }
}

export const RuntimeContext = new RuntimeContextClass();
