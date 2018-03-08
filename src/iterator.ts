import { BaseClass } from './class';

export class Iterator extends BaseClass {
  private array: any[];
  private currentIndex: number;

  constructor(array?: any[]) {
    super();
    this.array = array || [];
    this.reset();
  }

  /**
   * Sets the iterator pointer to the first item
   */
  public reset() {
    this.currentIndex = 0;
  }

  /**
   * Checks if there are more items the iterator can return.
   * @see #next
   * @return Boolean true if the following call to next() will return an object.
   */
  public hasNext(): boolean {
    return this.currentIndex < this.array.length;
  }

  /**
   * Returns the next item and increments the iterator.
   * @return The next item from the iterator, or undefined if there are no more items.
   */
  public next() {
    if (this.hasNext()) {
      return this.array[this.currentIndex++];
    }
    return undefined;
  }

  /**
   * Returns the next item but does not increment the iterator
   * @return The next item from the iterator, or undefined if there are no more items.
   */
  public peek() {
    return this.array[this.currentIndex];
  }

  /**
   * Returns the the pointer value.
   * @return The pointer value
   */
  public getPointer() {
    return this.currentIndex;
  }

  public isEmpty() {
    return this.array.length === 0;
  }
  /**
   * Returns the length of the array.
   * @return The length of the array
   */
  public getLength() {
    return this.array.length;
  }
}
