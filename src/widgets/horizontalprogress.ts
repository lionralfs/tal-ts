// import { Device } from '../devices/device';
// import { Container } from './container';
// import { Label } from './label';

// /**
//  * The horizontal progress widget provides a UI control for showing progress (with associated label)
//  */
// export class HorizontalProgress extends Container {
//   private value: number;
//   private moveHandle: boolean;
//   private lastLeft: number;
//   private label: Label;
//   private leftElement: HTMLElement;
//   private innerElement: HTMLElement;

//   /**
//    * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
//    * @param showLabel Pass <code>true</code> to show a label that indicates the value of the progress shown.
//    * @param initialValue The initial value (default 0).
//    */
//   constructor(id?: string, showLabel?: boolean, initialValue?: number) {
//     super(id);

//     this.value = initialValue ? initialValue : 0;
//     this.moveHandle = false;
//     this.lastLeft = null;
//     this.addClass('horizontalprogress');

//     if (showLabel) {
//       this.label = new Label(id + '_label', '');
//       this.addClass('haslabel');
//     }
//   }

//   /**
//    * Renders the widget and any child widgets to device-specific output.
//    * @param device The device to render to.
//    * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
//    */
//   public render(device: Device) {
//     this.outputElement = device.createContainer(this.id, this.getClasses());
//     this.leftElement = device.createContainer(this.id + '_left');
//     this.innerElement = device.createContainer(this.id + '_inner');
//     device.appendChildElement(this.leftElement, this.innerElement);
//     device.appendChildElement(this.outputElement, this.leftElement);

//     if (this.label) {
//       device.appendChildElement(this.outputElement, this.label.render(device));
//     }

//     this.moveInner();

//     return this.outputElement;
//   }

//   /**
//    * Returns the current value shown by the progress indicator.
//    */
//   public getValue() {
//     return this.value;
//   }

//   /**
//    * Sets the current value to be shown by the progress indicator.
//    * @param val The value to show (between 0.0 and 1.0 inclusive).
//    */
//   public setValue(val: number) {
//     this.value = val;
//     this.moveInner();
//   }
//   /**
//    * Sets the text to show in the label.
//    * @param val The text to show.
//    */
//   public setText(val: string) {
//     if (this.label) {
//       this.label.setText(val);
//     }
//   }

//   /**
//    * Moves the inner element to show the current value.
//    */
//   private moveInner() {
//     const device = this.getCurrentApplication().getDevice();
//     const elsize = device.getElementSize(this.leftElement);
//     const handleSize = device.getElementSize(this.innerElement);
//     const left = Math.floor(this.value * (elsize.width - handleSize.width));

//     if (left !== this.lastLeft) {
//       this.lastLeft = left;

//       if (this.moveHandle) {
//         device.stopAnimation(this.moveHandle);
//       }

//       const config = device.getConfig();
//       const animate =
//         !config.widgets || !config.widgets.horizontalprogress || config.widgets.horizontalprogress.animate !== false;
//       this.moveHandle = device.moveElementTo({
//         el: this.innerElement,
//         to: { left },
//         skipAnim: !animate
//       });
//     }
//   }
// }
