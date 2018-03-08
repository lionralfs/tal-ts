import { Container } from '..';
import { WidgetStrip } from '../widgets/carousel/strips/widgetstrip';
import { BaseEvent } from './event';

/**
 * Class of events raised when a Mask is about to change alignment of its widget strip.
 */
export class AfterAlignEvent extends BaseEvent {
  public target: Container;
  public alignedIndex: number;

  /**
   * @param target The mask that is about to align the strip
   * @param alignedIndex
   */
  constructor(target: Container, alignedIndex: number) {
    super('afteralign');
    this.target = target;
    this.alignedIndex = alignedIndex;
  }
}
