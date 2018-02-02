import { Application } from '../application';
import { HTML5MediaPlayer } from '../mediaplayer/html5';
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

    const image = new Image(
      'test',
      'https://camo.githubusercontent.com/99241f22340cba680873fede16c2dabb20cd76a9/68747470733a2f2f6262632e6769746875622e696f2f74616c2f696d672f74616c2d6c6f676f2d62772d736d616c6c2e6a7067'
    );
    container.appendChildWidget(image);

    const videoplayer = new HTML5MediaPlayer();
    videoplayer.setSource(HTML5MediaPlayer.TYPE.VIDEO, 'https://www.w3schools.com/html/mov_bbb.mp4', 'video/mp4');
    videoplayer.beginPlayback();
  }

  public route() {
    console.log('route');
  }
}

const rootEl = document.getElementById('root');
const test = new TestApp(rootEl, '', '', () => {
  console.log('ready');
});
