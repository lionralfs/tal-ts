import { HTML5MediaPlayer } from '../mediaplayer/html5';
import { Button } from '../widgets/button';
import { Component } from '../widgets/component';
import { Label } from '../widgets/label';

export class MyVideoPlayer extends Component {
  constructor() {
    super();

    this.addClass('videoplayer');

    const videoplayer = new HTML5MediaPlayer();
    videoplayer.setSource(HTML5MediaPlayer.TYPE.VIDEO, 'https://www.w3schools.com/html/mov_bbb.mp4', 'video/mp4');

    videoplayer.beginPlayback();

    // const backButton = new Button();
    // backButton.appendChildWidget(new Label('back-label', 'Back (backspace)'));
    // backButton.addClass('backbutton');
    // backButton.focus();

    // this.appendChildWidget(backButton);
  }
}
