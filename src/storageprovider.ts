import { BaseClass } from './class';

export enum STORAGE_TYPE {
  SESSION = 0,
  PERSISTENT = 1
}

export class StorageProvider extends BaseClass {
  public static STORAGE_TYPE = STORAGE_TYPE;

  protected valueCache: { [key: string]: string };

  constructor() {
    super();
    this.valueCache = {};
  }

  public getItem(key: string): string {
    return this.valueCache[key];
  }

  public setItem(key: string, value: string): void {
    this.valueCache[key] = value;
  }

  public removeItem(key: string): void {
    delete this.valueCache[key];
  }

  public clear(): void {
    this.valueCache = {};
  }

  public isEmpty(): boolean {
    let prop;
    for (prop in this.valueCache) {
      if (this.valueCache.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }
}
