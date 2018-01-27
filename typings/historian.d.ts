export interface IHistorian {
    back(): string;
    forward(destinationUrl: string): string;
    toString(): string;
    hasHistory(): boolean;
    hasBroadcastOrigin(): boolean;
}
export declare class Historian implements IHistorian {
    static HISTORY_TOKEN: string;
    static ROUTE_TOKEN: string;
    static BROADCAST_ENTRY: string;
    private historyArray;
    private currentUrl;
    constructor(currentUrl: string);
    back(): string;
    forward(destinationUrl: string): string;
    toString(): string;
    hasHistory(): boolean;
    hasBroadcastOrigin(): boolean;
}
