import { Application } from '../application';
import { Container } from '../widgets/container';

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
  }

  public route() {
    console.log('route');
  }
}

const rootEl = document.getElementById('root');
const test = new TestApp(rootEl, '', '', () => {
  console.log('ready');
});
