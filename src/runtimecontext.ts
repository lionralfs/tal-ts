import { BaseClass } from './class';
import { Application } from './application';

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

  clearCurrentApplication() {
    this.applicationObject = null;
  }

  setCurrentApplication(app: Application) {
    if (this.applicationObject) {
      throw new Error(
        'RuntimeContext.setCurrentApplication called for a second time. You can only have one application instance running at any time.'
      );
    } else {
      this.applicationObject = app;
    }
  }

  getCurrentApplication() {
    return this.applicationObject;
  }

  getDevice() {
    return this.getCurrentApplication().getDevice();
  }
}

export const RuntimeContext = new RuntimeContextClass();
