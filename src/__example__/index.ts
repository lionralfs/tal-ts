import { Application } from '../application';
import { Container } from '../widgets/container';
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

    const label = new Label('asdf', 'Hello World');
    container.appendChildWidget(label);
  }

  public route() {
    console.log('route');
  }
}

const rootEl = document.getElementById('root');
const test = new TestApp(rootEl, '', '', () => {
  console.log('ready');
});
