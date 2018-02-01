import { Application } from '../application';
import { Button } from '../widgets/button';
import { Container } from '../widgets/container';
import { Image } from '../widgets/image';
import { Label } from '../widgets/label';

class TestApp extends Application {
  private appDiv: HTMLElement;

  constructor(appDiv, styleDir, imgDir, callback) {
    super(appDiv, styleDir, imgDir, callback);

    this.appDiv = appDiv;
  }

  public run() {
    console.log('app is running');
    const container = new Container();
    container.addClass('testcontainer');

    container.outputElement = this.appDiv;
    this.setRootWidget(container);

    const button = new Button();
    const label = new Label('asdf', 'Hello World');
    button.appendChildWidget(label);
    container.appendChildWidget(button);

    const image = new Image('test', 'image/test.png');

    container.appendChildWidget(image);
  }

  public route() {
    console.log('route');
  }
}

const rootEl = document.getElementById('root');
const test = new TestApp(rootEl, '', '', () => {
  console.log('ready');
});
