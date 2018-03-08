import { WidgetStrip } from '../widgets/carousel/strips/widgetstrip';
import { BaseEvent } from './event';

/**
 * Class of events raised when a Mask is about to change alignment of its widget strip.
 */
export class BeforeAlignEvent extends BaseEvent {
  public target: WidgetStrip;
  public alignedIndex: number;

  /**
   * @param target The mask that is about to align the strip
   * @param alignedIndex
   */
  constructor(target: WidgetStrip, alignedIndex: number) {
    super('beforealign');
    this.target = target;
    this.alignedIndex = alignedIndex;
  }
}
