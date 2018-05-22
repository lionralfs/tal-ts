import { BaseClass } from './class';
export declare class Iterator<T> extends BaseClass {
    currentIndex: number;
    private array;
    constructor(array?: T[]);
    /**
     * Sets the iterator pointer to the first item
     */
    reset(): void;
    /**
     * Checks if there are more items the iterator can return.
     * @see #next
     * @return Boolean true if the following call to next() will return an object.
     */
    hasNext(): boolean;
    /**
     * Returns the next item and increments the iterator.
     * @return The next item from the iterator, or undefined if there are no more items.
     */
    next(): T;
    /**
     * Returns the next item but does not increment the iterator
     * @return The next item from the iterator, or undefined if there are no more items.
     */
    peek(): T;
    /**
     * Returns the the pointer value.
     * @return The pointer value
     */
    getPointer(): number;
    isEmpty(): boolean;
    /**
     * Returns the length of the array.
     * @return The length of the array
     */
    getLength(): number;
}
