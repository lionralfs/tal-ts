import { Application } from '../application';
import { KeyEvent } from '../events/keyevent';
import { HTML5MediaPlayer } from '../mediaplayer/html5';
import { Button } from '../widgets/button';
import { Container } from '../widgets/container';
import { Image } from '../widgets/image';
import { Label } from '../widgets/label';

class TestApp extends Application {
  private appDiv: HTMLElement;

  constructor(appDiv, styleDir, imgDir) {
    super(appDiv, styleDir, imgDir);

    this.appDiv = appDiv;
  }

  public run() {
    const container = new Container();
    container.outputElement = this.appDiv;
    this.setRootWidget(container);

    this.addComponentContainer('maincontainer');

    const button = new Button();
    const label = new Label('testlabel', 'Launch custom video player (press enter)');
    button.appendChildWidget(label);

    container.appendChildWidget(button);

    button.addEventListener('keydown', e => {
      if (e.keyCode === KeyEvent.VK_ENTER) {
        this.pushComponent('maincontainer', 'videoplayer');
        console.log('click');
      }
    });
  }

  public route() {
    console.log('route');
  }
}

const rootEl = document.getElementById('root');
const test = new TestApp(rootEl, '', '');
