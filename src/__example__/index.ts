import { Application } from '../application';
import { Container } from '../widgets/container';

class TestApp extends Application {
  private appDiv: HTMLElement;
  private setRootContainer: () => void;

  constructor(appDiv, styleDir, imgDir, readyHandler) {
    super(appDiv, styleDir, imgDir, readyHandler);

    this.appDiv = appDiv;

    this.setRootContainer = () => {
      const container = new Container();
      container.outputElement = appDiv;
      this.setRootWidget(container);
    };
  }

  public run() {
    this.setRootContainer();

    // Launch our custom 'page' component
    this.addComponentContainer('maincontainer', 'page');
  }

  public route() {
    //
  }
}

const rootEl = document.getElementById('root');
const test = new TestApp(rootEl, '', '', () => console.log('app is ready'));
