import { Navigator } from './navigator';
export declare class BookendedNavigator extends Navigator {
    /**
     * @param index
     * @return the first focussable index after that supplied
     */
    indexAfter(index: number): number;
    /**
     * @param index
     * @return the first focussable index before that supplied
     */
    indexBefore(index: number): number;
    protected isValidIndex(index: number): boolean;
    private validateIndex(potentialIndex);
}
