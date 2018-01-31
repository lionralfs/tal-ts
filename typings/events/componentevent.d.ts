import { Component } from '../widgets/component';
import { ComponentContainer } from '../widgets/componentcontainer';
import { BaseEvent } from './event';
/**
 * Class of events raised when a Component is being loaded/shown/hidden.
 */
export declare class ComponentEvent extends BaseEvent {
    container: ComponentContainer;
    component: Component;
    args: object;
    state: object;
    fromBack: boolean;
    /**
     * Creates new event instance
     * @param type The type of event.
     * @param container The container of the component that fired the event.
     * @param component The component that fired the event.
     * @param args Any arguments that were passed into the component when loaded.
     * @param state Any state information that was stored on the component history stack for this component.
     * @param fromBack True if the event was raised as a result of the user navigating 'back' in the component history.
     */
    constructor(type: string, container: ComponentContainer, component: Component, args: object, state: object, fromBack: boolean);
}
