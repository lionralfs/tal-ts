import { KeyEvent } from '../events/keyevent';
import { Button } from '../widgets/button';
import { Component } from '../widgets/component';
import { Label } from '../widgets/label';

export class Page extends Component {
  private button: Button;

  constructor() {
    super();

    const button = new Button();
    const label = new Label('testlabel', 'Launch custom video player (press enter)');
    button.appendChildWidget(label);

    button.addEventListener('keydown', e => {
      if (e.keyCode === KeyEvent.VK_ENTER) {
        // launch the videoplayer
        this.getCurrentApplication().pushComponent('maincontainer', 'videoplayer');
      }
    });
    this.appendChildWidget(button);
  }
}
