import { RuntimeContext } from '../runtimecontext';
import { MediaPlayer, MediaPlayerEvent, MediaPlayerState, MediaPlayerType } from './mediaplayer';

/**
 * Main MediaPlayer implementation for HTML5 devices.
 * Use this device modifier if a device implements the HTML5 media playback standard.
 * It must support creation of `video` and `audio` elements, and those objects must expose an
 * API in accordance with the HTML5 media specification.
 */
export class HTML5MediaPlayer extends MediaPlayer {
  private trustZeroes: boolean;
  private ignoreNextPauseEvent: boolean;
  private source: string;
  private mimeType: string;
  private mediaElement: HTMLMediaElement;
  private sourceElement: HTMLSourceElement;
  private lastSentinelTime: number;
  private sentinelInterval: number;
  private sentinelIntervalNumber: number;
  private hasSentinelTimeChangedWithinTolerance: boolean;
  private nearEndOfMedia: boolean;
  private sentinelLimits: {
    pause: {
      maximumAttempts: number;
      successEvent: MediaPlayerEvent;
      failureEvent: MediaPlayerEvent;
      currentAttemptCount: number;
    };
    seek: {
      maximumAttempts: 2;
      successEvent: MediaPlayerEvent;
      failureEvent: MediaPlayerEvent;
      currentAttemptCount: number;
    };
  };
  private targetSeekTime: number;
  private sentinelSeekTime: number;
  private readyToPlayFrom: boolean;
  private seekSentinelTolerance: number;
  private enterBufferingSentinelAttemptCount: number;
  private postBufferingState: MediaPlayerState;

  constructor() {
    super();

    this.setSentinelLimits();
    this.state = MediaPlayer.STATE.EMPTY;

    // fixes `this` reference in event listener callbacks
    this.wrapOnFinishedBuffering = this.wrapOnFinishedBuffering.bind(this);
    this.wrapOnError = this.wrapOnError.bind(this);
    this.wrapOnEndOfMedia = this.wrapOnEndOfMedia.bind(this);
    this.wrapOnDeviceBuffering = this.wrapOnDeviceBuffering.bind(this);
    this.wrapOnStatus = this.wrapOnStatus.bind(this);
    this.wrapOnMetadata = this.wrapOnMetadata.bind(this);
    this.wrapOnPause = this.wrapOnPause.bind(this);
    this.wrapOnSourceError = this.wrapOnSourceError.bind(this);
  }

  public setSource(mediaType: MediaPlayerType, url: string, mimeType: string) {
    if (this.getState() === MediaPlayer.STATE.EMPTY) {
      this.trustZeroes = false;
      this.ignoreNextPauseEvent = false;
      this.type = mediaType;
      this.source = url;
      this.mimeType = mimeType;
      const device = RuntimeContext.getDevice();

      let idSuffix = 'Video';
      let tagName: 'video' | 'audio' = 'video';
      if (mediaType === MediaPlayer.TYPE.AUDIO || mediaType === MediaPlayer.TYPE.LIVE_AUDIO) {
        idSuffix = 'Audio';
        tagName = 'audio';
      }

      this.setSeekSentinelTolerance();

      this.mediaElement = device.createElement(tagName, 'mediaPlayer' + idSuffix);
      this.mediaElement.autoplay = false;
      this.mediaElement.style.position = 'absolute';
      this.mediaElement.style.top = '0px';
      this.mediaElement.style.left = '0px';
      this.mediaElement.style.width = '100%';
      this.mediaElement.style.height = '100%';

      this.mediaElement.addEventListener('canplay', this.wrapOnFinishedBuffering, false);
      this.mediaElement.addEventListener('seeked', this.wrapOnFinishedBuffering, false);
      this.mediaElement.addEventListener('playing', this.wrapOnFinishedBuffering, false);
      this.mediaElement.addEventListener('error', this.wrapOnError, false);
      this.mediaElement.addEventListener('ended', this.wrapOnEndOfMedia, false);
      this.mediaElement.addEventListener('waiting', this.wrapOnDeviceBuffering, false);
      this.mediaElement.addEventListener('timeupdate', this.wrapOnStatus, false);
      this.mediaElement.addEventListener('loadedmetadata', this.wrapOnMetadata, false);
      this.mediaElement.addEventListener('pause', this.wrapOnPause, false);

      const appElement = RuntimeContext.getCurrentApplication().getRootWidget().outputElement;
      device.prependChildElement(appElement, this.mediaElement);

      this.sourceElement = this.generateSourceElement(url, mimeType);
      this.sourceElement.addEventListener('error', this.wrapOnSourceError, false);

      this.mediaElement.preload = 'auto';
      device.appendChildElement(this.mediaElement, this.sourceElement);

      this.mediaElement.load();

      this.toStopped();
    } else {
      this.toError(`Cannot set source unless in the '${MediaPlayer.STATE.EMPTY}' state`);
    }
  }

  public playFrom(seconds: number) {
    this.postBufferingState = MediaPlayer.STATE.PLAYING;
    this.targetSeekTime = seconds;
    this.sentinelLimits.seek.currentAttemptCount = 0;

    switch (this.getState()) {
      case MediaPlayer.STATE.PAUSED:
      case MediaPlayer.STATE.COMPLETE:
        this.trustZeroes = true;
        this.toBuffering();
        this.playFromIfReady();
        break;

      case MediaPlayer.STATE.BUFFERING:
        this.playFromIfReady();
        break;

      case MediaPlayer.STATE.PLAYING:
        this.trustZeroes = true;
        this.toBuffering();
        this.targetSeekTime = this.getClampedTimeForPlayFrom(seconds);
        if (this.isNearToCurrentTime(this.targetSeekTime)) {
          this.targetSeekTime = undefined;
          this.toPlaying();
        } else {
          this.playFromIfReady();
        }
        break;

      default:
        this.toError(`Cannot playFrom while in the '${this.getState()}' state`);
        break;
    }
  }

  public beginPlayback() {
    this.postBufferingState = MediaPlayer.STATE.PLAYING;
    this.sentinelSeekTime = undefined;
    switch (this.getState()) {
      case MediaPlayer.STATE.STOPPED:
        this.trustZeroes = true;
        this.toBuffering();
        this.mediaElement.play();
        break;

      default:
        this.toError(`Cannot beginPlayback while in the '${this.getState()}' state`);
        break;
    }
  }

  public beginPlaybackFrom(seconds: number) {
    this.postBufferingState = MediaPlayer.STATE.PLAYING;
    this.targetSeekTime = seconds;
    this.sentinelLimits.seek.currentAttemptCount = 0;

    switch (this.getState()) {
      case MediaPlayer.STATE.STOPPED:
        this.trustZeroes = true;
        this.toBuffering();
        this.playFromIfReady();
        break;

      default:
        this.toError(`Cannot beginPlaybackFrom while in the '${this.getState()}' state`);
        break;
    }
  }

  public pause() {
    this.postBufferingState = MediaPlayer.STATE.PAUSED;
    switch (this.getState()) {
      case MediaPlayer.STATE.PAUSED:
        break;

      case MediaPlayer.STATE.BUFFERING:
        this.sentinelLimits.pause.currentAttemptCount = 0;
        if (this.isReadyToPlayFrom()) {
          // If we are not ready to playFrom, then calling pause would seek to the start of media, which we might not want.
          this.pauseMediaElement();
        }
        break;

      case MediaPlayer.STATE.PLAYING:
        this.sentinelLimits.pause.currentAttemptCount = 0;
        this.pauseMediaElement();
        this.toPaused();
        break;

      default:
        this.toError(`Cannot pause while in the '${this.getState()}' state`);
        break;
    }
  }

  public resume() {
    this.postBufferingState = MediaPlayer.STATE.PLAYING;
    switch (this.getState()) {
      case MediaPlayer.STATE.PLAYING:
        break;

      case MediaPlayer.STATE.BUFFERING:
        if (this.isReadyToPlayFrom()) {
          // If we are not ready to playFrom, then calling play would seek to the start of media, which we might not want.
          this.mediaElement.play();
        }
        break;

      case MediaPlayer.STATE.PAUSED:
        this.mediaElement.play();
        this.toPlaying();
        break;

      default:
        this.toError(`Cannot resume while in the '${this.getState()}' state`);
        break;
    }
  }

  public stop() {
    switch (this.getState()) {
      case MediaPlayer.STATE.STOPPED:
        break;

      case MediaPlayer.STATE.BUFFERING:
      case MediaPlayer.STATE.PLAYING:
      case MediaPlayer.STATE.PAUSED:
      case MediaPlayer.STATE.COMPLETE:
        this.pauseMediaElement();
        this.toStopped();
        break;

      default:
        this.toError(`Cannot stop while in the '${this.getState()}' state`);
        break;
    }
  }

  public reset() {
    switch (this.getState()) {
      case MediaPlayer.STATE.EMPTY:
        break;

      case MediaPlayer.STATE.STOPPED:
      case MediaPlayer.STATE.ERROR:
        this.toEmpty();
        break;

      default:
        this.toError(`Cannot reset while in the '${this.getState()}' state`);
        break;
    }
  }

  public getSource(): string {
    return this.source;
  }

  public getMimeType(): string {
    return this.mimeType;
  }

  public getCurrentTime() {
    switch (this.getState()) {
      case MediaPlayer.STATE.STOPPED:
      case MediaPlayer.STATE.ERROR:
        break;

      default:
        if (this.mediaElement) {
          return this.mediaElement.currentTime;
        }
        break;
    }
    return undefined;
  }

  public getState() {
    return this.state;
  }

  public getPlayerElement() {
    return this.mediaElement;
  }

  public getMediaDuration() {
    if (this.mediaElement && this.isReadyToPlayFrom()) {
      return this.mediaElement.duration;
    }
    return undefined;
  }

  public getSeekableRange() {
    switch (this.getState()) {
      case MediaPlayer.STATE.STOPPED:
      case MediaPlayer.STATE.ERROR:
        break;

      default:
        return this.getSeekableRangeFromElement();
    }
    return undefined;
  }

  private getSeekableRangeFromElement() {
    if (this.mediaElement) {
      if (this.isReadyToPlayFrom() && this.mediaElement.seekable && this.mediaElement.seekable.length > 0) {
        return {
          start: this.mediaElement.seekable.start(0),
          end: this.mediaElement.seekable.end(0)
        };
      } else if (this.mediaElement.duration !== undefined) {
        return {
          start: 0,
          end: this.mediaElement.duration
        };
      } else {
        RuntimeContext.getDevice()
          .getLogger()
          .warn("No 'duration' or 'seekable' on media element");
      }
    }
    return undefined;
  }

  private onFinishedBuffering() {
    this.exitBuffering();
  }

  private pauseMediaElement() {
    this.mediaElement.pause();
    this.ignoreNextPauseEvent = true;
  }

  private onPause() {
    if (this.ignoreNextPauseEvent) {
      this.ignoreNextPauseEvent = false;
      return;
    }

    if (this.getState() !== MediaPlayer.STATE.PAUSED) {
      this.toPaused();
    }
  }

  private onDeviceError() {
    this.reportError(`Media element error code: ${this.mediaElement.error.code}`);
  }

  private onSourceError() {
    this.reportError('Media source element error');
  }

  private onDeviceBuffering() {
    if (this.getState() === MediaPlayer.STATE.PLAYING) {
      this.toBuffering();
    }
  }

  private onEndOfMedia() {
    this.toComplete();
  }

  private onStatus() {
    if (this.getState() === MediaPlayer.STATE.PLAYING) {
      this.emitEvent(MediaPlayer.EVENT.STATUS);
    }
  }

  private onMetadata() {
    this.metadataLoaded();
  }

  private exitBuffering() {
    this.metadataLoaded();
    if (this.getState() !== MediaPlayer.STATE.BUFFERING) {
      return;
    } else if (this.postBufferingState === MediaPlayer.STATE.PAUSED) {
      this.toPaused();
    } else {
      this.toPlaying();
    }
  }

  private metadataLoaded() {
    this.readyToPlayFrom = true;
    if (this.waitingToPlayFrom()) {
      this.deferredPlayFrom();
    }
  }

  private playFromIfReady() {
    if (this.isReadyToPlayFrom()) {
      if (this.waitingToPlayFrom()) {
        this.deferredPlayFrom();
      }
    }
  }

  private waitingToPlayFrom() {
    return this.targetSeekTime !== undefined;
  }

  private deferredPlayFrom() {
    this.seekTo(this.targetSeekTime);
    this.mediaElement.play();
    if (this.postBufferingState === MediaPlayer.STATE.PAUSED) {
      this.pauseMediaElement();
    }
    this.targetSeekTime = undefined;
  }

  private seekTo(seconds) {
    const clampedTime = this.getClampedTimeForPlayFrom(seconds);
    this.mediaElement.currentTime = clampedTime;
    this.sentinelSeekTime = clampedTime;
  }

  private wrapOnFinishedBuffering() {
    this.onFinishedBuffering();
  }

  private wrapOnError() {
    this.onDeviceError();
  }

  private wrapOnEndOfMedia() {
    this.onEndOfMedia();
  }

  private wrapOnDeviceBuffering() {
    this.onDeviceBuffering();
  }

  private wrapOnStatus() {
    this.onStatus();
  }

  private wrapOnMetadata() {
    this.onMetadata();
  }

  private wrapOnSourceError() {
    this.onSourceError();
  }

  private wrapOnPause() {
    this.onPause();
  }

  private getClampedTimeForPlayFrom(seconds: number): number {
    const clampedTime = this.getClampedTime(seconds);
    if (clampedTime !== seconds) {
      const range = this.getSeekableRange();
      RuntimeContext.getDevice()
        .getLogger()
        .debug(
          'playFrom ' +
            seconds +
            ' clamped to ' +
            clampedTime +
            ' - seekable range is { start: ' +
            range.start +
            ', end: ' +
            range.end +
            ' }'
        );
    }
    return clampedTime;
  }

  private wipe() {
    this.type = undefined;
    this.source = undefined;
    this.mimeType = undefined;
    this.targetSeekTime = undefined;
    this.sentinelSeekTime = undefined;
    this.clearSentinels();
    this.destroyMediaElement();
    this.readyToPlayFrom = false;
  }

  private destroyMediaElement() {
    if (this.mediaElement) {
      this.mediaElement.removeEventListener('canplay', this.wrapOnFinishedBuffering, false);
      this.mediaElement.removeEventListener('seeked', this.wrapOnFinishedBuffering, false);
      this.mediaElement.removeEventListener('playing', this.wrapOnFinishedBuffering, false);
      this.mediaElement.removeEventListener('error', this.wrapOnError, false);
      this.mediaElement.removeEventListener('ended', this.wrapOnEndOfMedia, false);
      this.mediaElement.removeEventListener('waiting', this.wrapOnDeviceBuffering, false);
      this.mediaElement.removeEventListener('timeupdate', this.wrapOnStatus, false);
      this.mediaElement.removeEventListener('loadedmetadata', this.wrapOnMetadata, false);
      this.mediaElement.removeEventListener('pause', this.wrapOnPause, false);
      this.sourceElement.removeEventListener('error', this.wrapOnSourceError, false);

      const device = RuntimeContext.getDevice();
      device.removeElement(this.sourceElement);

      this.unloadMediaSrc();

      device.removeElement(this.mediaElement);
      delete this.mediaElement;
      delete this.sourceElement;
    }
  }

  private unloadMediaSrc() {
    // Reset source as advised by HTML5 video spec, section 4.8.10.15:
    // http://www.w3.org/TR/2011/WD-html5-20110405/video.html#best-practices-for-authors-using-media-elements
    this.mediaElement.removeAttribute('src');
    this.mediaElement.load();
  }

  private generateSourceElement(url, mimeType) {
    const device = RuntimeContext.getDevice();
    const sourceElement = device.createElement('source');
    sourceElement.src = url;
    sourceElement.type = mimeType;
    return sourceElement;
  }

  private reportError(errorMessage: string) {
    RuntimeContext.getDevice()
      .getLogger()
      .error(errorMessage);
    this.emitEvent(MediaPlayer.EVENT.ERROR, { errorMessage });
  }

  private toStopped() {
    this.state = MediaPlayer.STATE.STOPPED;
    this.emitEvent(MediaPlayer.EVENT.STOPPED);
    this.setSentinels([]);
  }

  private toBuffering() {
    this.state = MediaPlayer.STATE.BUFFERING;
    this.emitEvent(MediaPlayer.EVENT.BUFFERING);
    this.setSentinels([this.exitBufferingSentinel]);
  }

  private toPlaying() {
    this.state = MediaPlayer.STATE.PLAYING;
    this.emitEvent(MediaPlayer.EVENT.PLAYING);
    this.setSentinels([this.endOfMediaSentinel, this.shouldBeSeekedSentinel, this.enterBufferingSentinel]);
  }

  private toPaused() {
    this.state = MediaPlayer.STATE.PAUSED;
    this.emitEvent(MediaPlayer.EVENT.PAUSED);
    this.setSentinels([this.shouldBeSeekedSentinel, this.shouldBePausedSentinel]);
  }

  private toComplete() {
    this.state = MediaPlayer.STATE.COMPLETE;
    this.emitEvent(MediaPlayer.EVENT.COMPLETE);
    this.setSentinels([]);
  }

  private toEmpty() {
    this.wipe();
    this.state = MediaPlayer.STATE.EMPTY;
  }

  private toError(errorMessage: string) {
    this.wipe();
    this.state = MediaPlayer.STATE.ERROR;
    this.reportError(errorMessage);
    throw new Error('ApiError: ' + errorMessage);
  }

  private clearSentinels() {
    clearInterval(this.sentinelInterval);
  }

  private setSentinels(sentinels: Array<(object) => boolean>) {
    this.clearSentinels();
    this.sentinelIntervalNumber = 0;
    this.lastSentinelTime = this.getCurrentTime();
    this.sentinelInterval = window.setInterval(() => {
      this.sentinelIntervalNumber += 1;
      const newTime = this.getCurrentTime();

      this.hasSentinelTimeChangedWithinTolerance = Math.abs(newTime - this.lastSentinelTime) > 0.2;
      this.nearEndOfMedia = this.getDuration() - (newTime || this.lastSentinelTime) <= 1;
      this.lastSentinelTime = newTime;

      for (const sentinel of sentinels) {
        const sentinelActivated: boolean = sentinel.call(this);

        if (this.getCurrentTime() > 0) {
          this.trustZeroes = false;
        }

        if (sentinelActivated) {
          break;
        }
      }
    }, 1100);
  }

  private setSentinelLimits() {
    this.sentinelLimits = {
      pause: {
        maximumAttempts: 2,
        successEvent: MediaPlayer.EVENT.SENTINEL_PAUSE,
        failureEvent: MediaPlayer.EVENT.SENTINEL_PAUSE_FAILURE,
        currentAttemptCount: 0
      },
      seek: {
        maximumAttempts: 2,
        successEvent: MediaPlayer.EVENT.SENTINEL_SEEK,
        failureEvent: MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE,
        currentAttemptCount: 0
      }
    };
  }

  private enterBufferingSentinel(): boolean {
    let sentinelShouldFire: boolean = !this.hasSentinelTimeChangedWithinTolerance && !this.nearEndOfMedia;

    if (this.getCurrentTime() === 0) {
      sentinelShouldFire = this.trustZeroes && sentinelShouldFire;
    }

    if (this.enterBufferingSentinelAttemptCount === undefined) {
      this.enterBufferingSentinelAttemptCount = 0;
    }

    if (sentinelShouldFire) {
      this.enterBufferingSentinelAttemptCount++;
    } else {
      this.enterBufferingSentinelAttemptCount = 0;
    }

    if (this.enterBufferingSentinelAttemptCount === 1) {
      sentinelShouldFire = false;
    }

    if (sentinelShouldFire) {
      this.emitEvent(MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
      this.toBuffering();
      /**
       * Resetting the sentinel attempt count to zero means that the sentinel will only fire once
       * even if multiple iterations result in the same conditions.
       * This should not be needed as the second iteration, when the enter buffering sentinel is fired
       * will cause the media player to go into the buffering state. The enter buffering sentinel is not fired
       * when in buffering state
       */
      this.enterBufferingSentinelAttemptCount = 0;
      return true;
    }

    return false;
  }

  private exitBufferingSentinel(): boolean {
    const fireExitBufferingSentinel = () => {
      this.emitEvent(MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
      this.exitBuffering();
      return true;
    };

    if (this.readyToPlayFrom && this.mediaElement.paused) {
      return fireExitBufferingSentinel();
    }

    if (this.hasSentinelTimeChangedWithinTolerance) {
      return fireExitBufferingSentinel();
    }
    return false;
  }

  private shouldBeSeekedSentinel(): boolean {
    if (this.sentinelSeekTime === undefined) {
      return false;
    }

    const currentTime = this.getCurrentTime();
    let sentinelActionTaken: boolean = false;

    if (Math.abs(currentTime - this.sentinelSeekTime) > this.seekSentinelTolerance) {
      sentinelActionTaken = this.nextSentinelAttempt(this.sentinelLimits.seek, () => {
        this.mediaElement.currentTime = this.sentinelSeekTime;
      });
    } else if (this.sentinelIntervalNumber < 3) {
      this.sentinelSeekTime = currentTime;
    } else {
      this.sentinelSeekTime = undefined;
    }

    return sentinelActionTaken;
  }

  private shouldBePausedSentinel(): boolean {
    let sentinelActionTaken: boolean = false;
    if (this.hasSentinelTimeChangedWithinTolerance) {
      sentinelActionTaken = this.nextSentinelAttempt(this.sentinelLimits.pause, () => {
        this.pauseMediaElement();
      });
    }

    return sentinelActionTaken;
  }

  private nextSentinelAttempt(
    sentinelInfo: { currentAttemptCount: number; maximumAttempts: number; failureEvent: string; successEvent: string },
    attemptFn: () => void
  ): boolean {
    let currentAttemptCount: number;
    let maxAttemptCount: number;

    sentinelInfo.currentAttemptCount += 1;
    currentAttemptCount = sentinelInfo.currentAttemptCount;
    maxAttemptCount = sentinelInfo.maximumAttempts;

    if (currentAttemptCount === maxAttemptCount + 1) {
      this.emitEvent(sentinelInfo.failureEvent);
    }

    if (currentAttemptCount <= maxAttemptCount) {
      attemptFn();
      this.emitEvent(sentinelInfo.successEvent);
      return true;
    }

    return false;
  }

  private endOfMediaSentinel(): boolean {
    if (!this.hasSentinelTimeChangedWithinTolerance && this.nearEndOfMedia) {
      this.emitEvent(MediaPlayer.EVENT.SENTINEL_COMPLETE);
      this.onEndOfMedia();
      return true;
    }
    return false;
  }

  private isReadyToPlayFrom() {
    if (this.readyToPlayFrom !== undefined) {
      return this.readyToPlayFrom;
    }
    return false;
  }

  private setSeekSentinelTolerance() {
    const ON_DEMAND_SEEK_SENTINEL_TOLERANCE = 15;
    const LIVE_SEEK_SENTINEL_TOLERANCE = 30;

    this.seekSentinelTolerance = ON_DEMAND_SEEK_SENTINEL_TOLERANCE;
    if (this.isLiveMedia()) {
      this.seekSentinelTolerance = LIVE_SEEK_SENTINEL_TOLERANCE;
    }
  }
}
