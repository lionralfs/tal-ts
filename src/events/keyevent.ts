import { BaseEvent } from './event';

export class KeyEvent extends BaseEvent {
  // TODO: maybe use an enum instead
  public static VK_ENTER = 13;
  public static VK_LEFT = 37;
  public static VK_UP = 38;
  public static VK_RIGHT = 39;
  public static VK_DOWN = 40;
  public static VK_SPACE = 32;

  public static VK_BACK_SPACE = 8;

  public static VK_0 = 48;
  public static VK_1 = 49;
  public static VK_2 = 50;
  public static VK_3 = 51;
  public static VK_4 = 52;
  public static VK_5 = 53;
  public static VK_6 = 54;
  public static VK_7 = 55;
  public static VK_8 = 56;
  public static VK_9 = 57;

  public static VK_A = 65;
  public static VK_B = 66;
  public static VK_C = 67;
  public static VK_D = 68;
  public static VK_E = 69;
  public static VK_F = 70;
  public static VK_G = 71;
  public static VK_H = 72;
  public static VK_I = 73;
  public static VK_J = 74;
  public static VK_K = 75;
  public static VK_L = 76;
  public static VK_M = 77;
  public static VK_N = 78;
  public static VK_O = 79;
  public static VK_P = 80;
  public static VK_Q = 81;
  public static VK_R = 82;
  public static VK_S = 83;
  public static VK_T = 84;
  public static VK_U = 85;
  public static VK_V = 86;
  public static VK_W = 87;
  public static VK_X = 88;
  public static VK_Y = 89;
  public static VK_Z = 90;

  public static VK_RED = 403;
  public static VK_GREEN = 404;
  public static VK_YELLOW = 405;
  public static VK_BLUE = 406;

  public static VK_HELP = 156;
  public static VK_SEARCH = 112;
  public static VK_AUDIODESCRIPTION = 113;
  public static VK_HD = 114;

  public static VK_PLAY = 415;
  public static VK_PAUSE = 19;
  public static VK_PLAY_PAUSE = 402;
  public static VK_STOP = 413;
  public static VK_PREV = 424;
  public static VK_NEXT = 425;
  public static VK_FAST_FWD = 417;
  public static VK_REWIND = 412;
  public static VK_INFO = 457;
  public static VK_SUBTITLE = 460;
  public static VK_BACK = 461;

  public static VK_VOLUME_UP = 447;
  public static VK_VOLUME_DOWN = 448;
  public static VK_MUTE = 449;

  public keyCode: number;
  public keyChar: string;

  constructor(type: string, keyCode: number) {
    super(type);
    this.keyCode = keyCode;

    let index;

    // Map hardware alphanumeric key codes back into characters (and space)
    if (keyCode >= KeyEvent.VK_0 && keyCode <= KeyEvent.VK_9) {
      index = keyCode - KeyEvent.VK_0;
      this.keyChar = String.fromCharCode('0'.charCodeAt(0) + index);
    } else if (keyCode === KeyEvent.VK_SPACE) {
      this.keyChar = ' ';
    } else if (keyCode >= KeyEvent.VK_A && keyCode <= KeyEvent.VK_Z) {
      index = keyCode - KeyEvent.VK_A;
      this.keyChar = String.fromCharCode('A'.charCodeAt(0) + index);
    }
  }
}
