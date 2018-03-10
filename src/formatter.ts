import { BaseClass } from './class';
import { Iterator } from './iterator';
import { Widget } from './widgets/widget';
/**
 * Base formatter. Takes an iterator to a data source and returns a widget tree to represent one or more items of data.
 */
export abstract class Formatter extends BaseClass {
  private opts;

  constructor(opts?) {
    super();
    if (opts) {
      this.opts = opts;
    }
  }

  /**
   * Formats data from the iterator.
   * @param iterator An iterator pointing to the data to be formatted.
   * @return A widget object representing one or more data items from the iterator.
   */
  public abstract format(iterator: Iterator): Widget;
}
