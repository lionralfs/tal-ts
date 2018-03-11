import { Application } from './application';
import { BaseClass } from './class';
import { Device } from './devices/device';

export interface IRuntimeContext extends BaseClass {
  clearCurrentApplication(): void;
  setCurrentApplication(app: Application): void;
  getCurrentApplication(): Application;
  getDevice(): object;
}

export class RuntimeContextClass extends BaseClass implements IRuntimeContext {
  private static applicationObject: Application;

  public clearCurrentApplication(): void {
    RuntimeContextClass.applicationObject = null;
  }

  public setCurrentApplication(app: Application): void {
    if (RuntimeContextClass.applicationObject) {
      throw new Error(
        'RuntimeContext.setCurrentApplication called for a second time. You can only have one application instance running at any time.'
      );
    } else {
      RuntimeContextClass.applicationObject = app;
    }
  }

  public getCurrentApplication(): Application {
    return RuntimeContextClass.applicationObject;
  }

  public getDevice(): Device {
    return this.getCurrentApplication().getDevice();
  }
}

export const RuntimeContext = new RuntimeContextClass();
