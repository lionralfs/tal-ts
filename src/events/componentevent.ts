import { Component } from '../widgets/component';
import { ComponentContainer } from '../widgets/componentcontainer';
import { BaseEvent } from './event';

/**
 * Class of events raised when a Component is being loaded/shown/hidden.
 */
export class ComponentEvent extends BaseEvent {
  public container: ComponentContainer;
  public component: Component;
  public args: object;
  public state: object;
  public fromBack: boolean;

  /**
   * Creates new event instance
   * @param type The type of event.
   * @param container The container of the component that fired the event.
   * @param component The component that fired the event.
   * @param args Any arguments that were passed into the component when loaded.
   * @param state Any state information that was stored on the component history stack for this component.
   * @param fromBack True if the event was raised as a result of the user navigating 'back' in the component history.
   */
  constructor(
    type: string,
    container: ComponentContainer,
    component: Component,
    args: object,
    state: object,
    fromBack: boolean
  ) {
    super(type);

    this.container = container;
    this.component = component;
    this.args = args;
    this.state = state;
    this.fromBack = fromBack;
  }
}
