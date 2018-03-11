import { StorageProvider } from '../../storageprovider';

export interface ICookieOptions {
  domain?: string;
  isPathless?: boolean;
  path?: string;
  secure?: boolean;
}

// http://www.quirksmode.org/js/cookies.html
const namespaces: { [key: string]: CookieStorage } = {};

const defaultDays = 366;
const pathParts = document.location.pathname.split('/');
pathParts.pop();
const path = pathParts.join('/') + '/';

const createCookie = (namespace: string, value: string, days: number, opts: ICookieOptions = {}): void => {
  value = encodeURIComponent(value);
  days = days || defaultDays;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  const cookiePath = opts.path || path;

  const cookieDataArray = [
    namespace + '=' + value,
    'expires=' + date.toUTCString(),
    'path=' + (opts.isPathless ? '/' : cookiePath)
  ];
  if (opts.domain) {
    cookieDataArray.push('domain=' + opts.domain);
  }
  if (opts.secure) {
    cookieDataArray.push('secure');
  }
  document.cookie = cookieDataArray.join('; ');
};

const readCookie = (namespace: string): string => {
  const nameEQ = namespace + '=';
  const ca = document.cookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
};

const eraseCookie = (namespace: string, opts?: ICookieOptions): void => {
  createCookie(namespace, '', -1, opts);
};

/**
 * Class for persistently storing date in cookies
 */
export class CookieStorage extends StorageProvider {
  private namespace: string;
  private opts: ICookieOptions;

  /**
   * @param namespace The cookie name to be used for this cookie storage object
   * @param opts.domain The domain value of the cookie, if not provided this is not set on the cookie
   * @param opts.isPathless If `true` sets the path to '/' else retrieves the path from the location
   * @param opts.path The path to save the cookie against
   * @param opts.secure The storage should be secure. Adds secure flag to cookie
   */
  constructor(namespace: string, opts?: ICookieOptions) {
    super();

    this.namespace = namespace;
    this.opts = opts || {};

    const cookie = readCookie(namespace);

    if (cookie) {
      try {
        this.valueCache = JSON.parse(cookie);
      } catch (e) {
        /* couldn't parse cookie, just ignore it */
      }
      if (this.valueCache) {
        this.save();
      } else {
        this.valueCache = {};
      }
    }
  }

  public setItem(key: string, value: string): void {
    super.setItem(key, value);
    this.save();
  }

  public removeItem(key: string): void {
    super.removeItem(key);
    this.save();
  }

  public clear(): void {
    super.clear();
    this.save();

    // delete it from the stored namespaces
    // so it will be reloaded the next time
    // we get it
    delete namespaces[this.namespace];
  }

  private save(): void {
    if (this.isEmpty()) {
      eraseCookie(this.namespace, this.opts);
    } else {
      const json = JSON.stringify(this.valueCache);
      createCookie(this.namespace, json, undefined, this.opts);
    }
  }
}
