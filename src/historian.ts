export interface IHistorian {
  back(): string;
  forward(destinationUrl: string): string;
  toString(): string;
  hasHistory(): boolean;
  hasBroadcastOrigin(): boolean;
}

export class Historian implements IHistorian {
  public static HISTORY_TOKEN = '&*history=';
  public static ROUTE_TOKEN = '&*route=';
  public static BROADCAST_ENTRY = 'broadcast';

  private historyArray: string[];
  private currentUrl: string;

  constructor(currentUrl: string) {
    let i;

    this.historyArray = currentUrl.split(Historian.HISTORY_TOKEN);
    this.currentUrl = this.historyArray.shift(); // non-history portion of the URL
    for (i = 0; i !== this.historyArray.length; i += 1) {
      this.historyArray[i] = Historian.HISTORY_TOKEN + this.historyArray[i];
    }
  }

  public back(): string {
    let recent: string;
    let remaining: string;
    let fragmentSeparator: string;

    const findRecentAndRemaining = () => {
      const history = this.historyArray;
      if (history.length > 0) {
        recent = history[0].split(Historian.HISTORY_TOKEN)[1];
        remaining = history.slice(1, history.length).join('');
      } else {
        recent = remaining = '';
      }
    };

    const processRoute = () => {
      if (recent.indexOf(Historian.ROUTE_TOKEN) !== -1) {
        fragmentSeparator = '';
        recent = recent.replace(Historian.ROUTE_TOKEN, '#');
      }
    };

    const buildBackUrl = () => {
      if (remaining) {
        return recent + fragmentSeparator + remaining;
      }
      return recent;
    };

    fragmentSeparator = '#';
    findRecentAndRemaining();
    processRoute();
    return buildBackUrl();
  }

  public forward(destinationUrl: string): string {
    let fragmentSeparator;

    const isRouteInDestination = () => destinationUrl.indexOf('#') !== -1;

    const replaceRouteInSource = () => {
      if (this.currentUrl.indexOf('#') !== -1) {
        this.currentUrl = this.currentUrl.replace('#', Historian.ROUTE_TOKEN);
      }
    };

    const addCurrentUrlToHistory = () => {
      this.historyArray.unshift(Historian.HISTORY_TOKEN + this.currentUrl);
    };

    // Some devices have a de facto URL length limit of around 1000 characters, so trim URL by dropping history elements.
    // Keep the oldest history entry - drop oldest items from the middle.
    const trimUrlHistoryToLength = () => {
      while (this.historyArray.length > 1 && this.toString().length + destinationUrl.length > 999) {
        this.historyArray.splice(-2, 1);
      }
    };

    if (this.currentUrl === '') {
      return destinationUrl;
    }

    replaceRouteInSource();
    addCurrentUrlToHistory();
    trimUrlHistoryToLength();
    fragmentSeparator = isRouteInDestination() ? '' : '#';
    return destinationUrl + fragmentSeparator + this.toString();
  }

  public toString(): string {
    return this.historyArray.join('');
  }

  public hasHistory(): boolean {
    const historyMinimumLength = this.hasBroadcastOrigin() ? 2 : 1;
    return this.historyArray.length >= historyMinimumLength;
  }

  public hasBroadcastOrigin(): boolean {
    return (
      this.historyArray.length > 0 &&
      this.historyArray[this.historyArray.length - 1] === Historian.HISTORY_TOKEN + Historian.BROADCAST_ENTRY
    );
  }
}
