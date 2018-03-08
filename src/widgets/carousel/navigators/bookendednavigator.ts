import { Navigator } from './navigator';

export class BookendedNavigator extends Navigator {
  /**
   * @param index
   * @return the first focussable index after that supplied
   */
  public indexAfter(index: number): number {
    const potentialIndex = super.indexAfter(index);
    return this.validateIndex(potentialIndex);
  }

  /**
   * @param index
   * @return the first focussable index before that supplied
   */
  public indexBefore(index: number): number {
    const potentialIndex = super.indexBefore(index);
    return this.validateIndex(potentialIndex);
  }

  protected isValidIndex(index: number): boolean {
    const stripLength = this.container.getChildWidgetCount();
    return typeof index === 'number' && index < stripLength && index >= 0;
  }

  private validateIndex(potentialIndex: number): number {
    let index = null;
    if (this.isValidIndex(potentialIndex)) {
      index = potentialIndex;
    }
    return index;
  }
}
