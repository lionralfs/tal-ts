import { KeyEvent } from '../events/keyevent';
import { HTML5MediaPlayer } from '../mediaplayer/html5';
import { RuntimeContext } from '../runtimecontext';
import { Button } from '../widgets/button';
import { Component } from '../widgets/component';
import { ComponentContainer } from '../widgets/componentcontainer';
import { Label } from '../widgets/label';

export class MyVideoPlayer extends Component {
  private backButton: Button;

  constructor() {
    super();

    this.addClass('videoplayer');

    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.destroyPlayer = this.destroyPlayer.bind(this);

    // Add a 'beforerender' event listener to the component that takes care of video instantiation
    this.addEventListener('beforerender', this.onBeforeRender);

    const backButton = new Button();
    backButton.appendChildWidget(new Label('back-label', 'Back (backspace)'));
    backButton.addClass('backbutton');
    this.appendChildWidget(backButton);

    backButton.addEventListener('keydown', e => {
      if (e.keyCode === KeyEvent.VK_BACK) {
        this.destroyPlayer();
        const parent: ComponentContainer = this.parentWidget as ComponentContainer;
        parent.back();
      }
    });

    this.backButton = backButton;
  }

  private getPlayer() {
    return RuntimeContext.getDevice().getMediaPlayer();
  }

  private onBeforeRender() {
    // Create the device's video object, set the media sources and start loading the media
    const player = this.getPlayer();
    player.setSource(HTML5MediaPlayer.TYPE.VIDEO, 'https://www.w3schools.com/html/mov_bbb.mp4', 'video/mp4');
    player.beginPlayback();
  }

  private destroyPlayer() {
    this.getPlayer().stop();
    this.getPlayer().reset();
  }
}
