import { BaseClass } from '../../class';
import { DataSource } from '../../datasource';
import { Formatter } from '../../formatter';
import { Container } from '../container';
export interface IBinderCallbacks {
    onSuccess: (data: any) => void;
    onError: (error?: object) => void;
}
/**
 * Class for adding children to an existing widget based on a combination
 * of a data source and formatter.
 */
export declare class Binder extends BaseClass {
    private dataSource;
    private formatter;
    constructor(formatter: Formatter, dataSource: DataSource);
    /**
     * Creates new widgets which are then appended to
     * the widget supplied. Continues until the end of the data returned
     * by the source is reached.
     * @param widget The parent of the widgets to be created.
     */
    appendAllTo(widget: Container): void;
    private bindAll(widget, processItemFn, preBindFn?, postBindFn?);
    private getCallbacks(widget, processItemFn, postBindFn?);
    private appendItem(widget, item);
}
