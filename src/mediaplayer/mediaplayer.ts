import { CallbackManager } from '../callbackmanager';
import { BaseClass } from '../class';
import { RuntimeContext } from '../runtimecontext';

export enum MediaPlayerState {
  /** No source set */
  EMPTY = 'EMPTY',
  /** Source set but no playback */
  STOPPED = 'STOPPED',
  /** Not enough data to play, waiting to download more */
  BUFFERING = 'BUFFERING',
  /** Media is playing */
  PLAYING = 'PLAYING',
  /** Media is paused */
  PAUSED = 'PAUSED',
  /** Media has reached its end point */
  COMPLETE = 'COMPLETE',
  /** An error occurred */
  ERROR = 'ERROR'
}

export enum MediaPlayerEvent {
  /** Event fired when playback is stopped */
  STOPPED = 'stopped',
  /** Event fired when playback has to suspend due to buffering */
  BUFFERING = 'buffering',
  /** Event fired when starting (or resuming) playing of the media */
  PLAYING = 'playing',
  /** Event fired when media playback pauses */
  PAUSED = 'paused',
  /** Event fired when media playback has reached the end of the media */
  COMPLETE = 'complete',
  /** Event fired when an error condition occurs */
  ERROR = 'error',
  /** Event fired regularly during play */
  STATUS = 'status',
  /** Event fired when a sentinel has to act because the device has started buffering but not reported it */
  SENTINEL_ENTER_BUFFERING = 'sentinel-enter-buffering',
  /** Event fired when a sentinel has to act because the device has finished buffering but not reported it */
  SENTINEL_EXIT_BUFFERING = 'sentinel-exit-buffering',
  /** Event fired when a sentinel has to act because the device has failed to pause when expected */
  SENTINEL_PAUSE = 'sentinel-pause',
  /** Event fired when a sentinel has to act because the device has failed to play when expected */
  SENTINEL_PLAY = 'sentinel-play',
  /** Event fired when a sentinel has to act because the device has failed to seek to the correct location */
  SENTINEL_SEEK = 'sentinel-seek',
  /** Event fired when a sentinel has to act because the device has completed the media but not reported it */
  SENTINEL_COMPLETE = 'sentinel-complete',
  /** Event fired when the pause sentinel has failed twice, so it is giving up */
  SENTINEL_PAUSE_FAILURE = 'sentinel-pause-failure',
  /** Event fired when the seek sentinel has failed twice, so it is giving up */
  SENTINEL_SEEK_FAILURE = 'sentinel-seek-failure',
  /** Event fired when a device using a seekfinishedemitevent modifier sets the source */
  SEEK_ATTEMPTED = 'seek-attempted',
  /** Event fired when a device using a seekfinishedemitevent modifier has seeked successfully */
  SEEK_FINISHED = 'seek-finished'
}

export enum MediaPlayerType {
  VIDEO = 'video',
  AUDIO = 'audio',
  LIVE_VIDEO = 'live-video',
  LIVE_AUDIO = 'live-audio'
}

/**
 * Levels of support for the live media player
 */
export enum MediaPlayerLiveSupport {
  NONE = 'none',
  PLAYABLE = 'playable',
  RESTARTABLE = 'restartable',
  SEEKABLE = 'seekable'
}

/**
 * Base class for media playback device modifiers.
 */
export abstract class MediaPlayer extends BaseClass {
  /**
   * An enumeration of possible media player states.
   */
  public static STATE = MediaPlayerState;

  /**
   * Media Player event names
   */
  public static EVENT = MediaPlayerEvent;

  /**
   * An enumeration of valid Media Types.
   */
  public static TYPE = MediaPlayerType;

  protected type: MediaPlayerType;
  protected state: MediaPlayerState;

  /**
   * Offset used when attempting to playFrom() the end of media. This allows the media to play briefly before completing.
   */
  private CLAMP_OFFSET_FROM_END_OF_RANGE: number = 1.1;

  /**
   * Time (in seconds) compared to current time within which seeking has no effect.
   */
  private CURRENT_TIME_TOLERANCE: number = 1;

  private callbackManager: CallbackManager;

  constructor() {
    super();
    this.callbackManager = new CallbackManager();
  }

  /**
   * Add an event callback to receive all media player events from now on.
   *
   * Note that failing to remove callbacks when you are finished with them can stop garbage collection
   * of objects/closures containing those callbacks and so create memory leaks in your application.
   * @param thisArg The object to use as 'this' when calling the callback.
   * @param callback Function to which events are passed (e.g. to be bubbled up the component hierarchy).
   */
  public addEventCallback(thisArg: object, callback: (...args: any[]) => void): void {
    this.callbackManager.addCallback(thisArg, callback);
  }

  /**
   * Stop receiving events with the specified callback.
   * @param thisArg The object specified to use as 'this' when adding the callback.
   * @param callback Function to which events are no longer to be passed
   */
  public removeEventCallback(thisArg: object, callback: (...args: any[]) => void): void {
    this.callbackManager.removeCallback(thisArg, callback);
  }

  /**
   * Stop receiving events to any callbacks.
   */
  public removeAllEventCallbacks(): void {
    this.callbackManager.removeAllCallbacks();
  }

  /**
   * Get the duration of the media in seconds.
   * For VOD playback, this is the duration of the media.
   * For Live playback, this is positive Infinity.
   * If no duration is available, this returns undefined.
   * Returns the duration of media in seconds, or Infinity, or undefined.
   */
  public getDuration(): number {
    switch (this.getState()) {
      case MediaPlayer.STATE.STOPPED:
      case MediaPlayer.STATE.ERROR:
        return undefined;
      default:
        if (this.isLiveMedia()) {
          return Infinity;
        }
        return this.getMediaDuration();
    }
  }

  /**
   * Set the media resource to be played.
   * Calling this in any state other than EMPTY is an error.
   * @param mediaType Value from the MediaPlayerType enum; audio or video.
   * @param url location of the media resource to play
   * @param mimeType type of media resource
   */
  public abstract setSource(mediaType: MediaPlayerType, url: string, mimeType: string): void;

  /**
   * Request that the media seeks to and starts playing from Time.
   * A media source must have been set with setSource before calling this.
   * This may transition to the buffering state if enough media data is not yet available to play.
   * If the media is buffering, call this to resume playback in a playing state once buffering ends.
   * Calling this in state EMPTY or STOPPED is an error.
   * Clamps the time to the seekable range of the media.
   * If trying to seek to (or past) the very end of the media, this will actually seek to before the end.
   * This allows the media playback to complete normally.
   * @param seconds Time to play from in seconds from the start of the media
   */
  public abstract playFrom(seconds: number): void;

  /**
   * Begin playback of the media resource from wherever the device chooses.
   * For On Demand assets, this will normally be the start, for Live stream assets it should be the live point
   * but could be the start of the stream window on some devices.
   * This function can only be called from the STOPPED state; calling it from any other state is an error.
   * To begin playback from a specified time offset, use the playFrom function instead.
   */
  public abstract beginPlayback(): void;

  /**
   * Begin playback of the media resource from Time.
   * A media source must have been set with setSource before calling this.
   * This can be used to resume media after changing source.
   * This function can only be called from the STOPPED state; calling it from any other state is an error.
   * Clamps the time to the seekable range of the media.
   * If trying to play at (or past) the very end of the media, this will actually begin playback before the end.
   * @param seconds Time to play from in seconds from the start of the media
   */
  public abstract beginPlaybackFrom(seconds: number): void;

  /**
   * Request that the media be paused.
   * If the Media is playing, call this to pause it.
   * If the media is buffering, call this to resume playback in a paused state once buffering ends.
   * Calling this in state EMPTY or STOPPED is an error.
   */
  public abstract pause(): void;

  /**
   * Request that the media resume playing after being paused.
   * If the Media is paused, call this to resume playing it.
   * If the media is buffering, call this to resume playback in a playing state once buffering ends.
   * Calling this in state EMPTY or STOPPED is an error.
   */
  public abstract resume(): void;

  /**
   * Request that the media be stopped.
   * If the Media is playing, call this to stop the media.
   * Note that the source is still set after calling stop.
   * Call reset after stop to unset the source.
   * Calling this in state EMPTY is an error.
   */
  public abstract stop(): void;

  /**
   * Reset the Media Player.
   * When the media is stopped, calling reset will reset the player to a clean state with no source set.
   * Calling this in any state other than STOPPED or ERROR is an error.
   */
  public abstract reset(): void;

  /**
   * Get the source URL.
   * If no source is set (in state EMPTY for example), then this returns undefined.
   *
   * Returns the URL
   */
  public abstract getSource(): string;

  /**
   * Get the source MIME type.
   * If no source is set (in state EMPTY for example), then this returns undefined.
   *
   * Returns the MIME type
   */
  public abstract getMimeType(): string;

  /**
   * Get the current play time.
   * If no current time is available, then this returns undefined.
   *
   * Returns the current play time in seconds from the start of the media.
   */
  public abstract getCurrentTime(): number;

  /**
   * Get the available seekable range of media.
   * Returns a range Object with 'start' and 'end' numeric properties, giving the start and end of the available media in seconds from the start of the media.
   * For VOD playback, 'start' is zero and 'end' is the last possible seek time (in many cases equal to duration).
   * For Live playback, 'start' may be non-zero, reflecting the amount of 'live rewind' available before the current play position.
   * For live playback, 'end' is the current live time.
   * For live playback, both 'start' and 'end' may advance over time.
   * If no range is available, this returns undefined.
   *
   * Returns an object with `start` and `end` times in seconds, or `undefined`.
   */
  public abstract getSeekableRange(): { start?: number; end?: number };

  /**
   * Get the current state of the Media PLayer state machine.
   * Returns the current state of the Media Player state machine.
   */
  public abstract getState(): MediaPlayerState;

  /**
   * Get the underlying DOM element used for media playback. Its type and signature will vary by device.
   * On devices that do not use HTML5 media playback this will not be a media element.
   * In general this should not be used by client applications.
   *
   * Returns the underlying DOM element used for media playback on this device.
   */
  public abstract getPlayerElement(): HTMLElement;

  protected abstract getMediaDuration(): number;

  /**
   * Protected method, for use by subclasses to emit events of any specified type, adding in the
   * standard payload used by all events.
   * @param eventType The type of the event to be emitted.
   * @param eventLabels Optional additional event labels.
   */
  protected emitEvent(eventType: string, eventLabels?: object): void {
    const event = {
      type: eventType,
      currentTime: this.getCurrentTime(),
      seekableRange: this.getSeekableRange(),
      duration: this.getDuration(),
      url: this.getSource(),
      mimeType: this.getMimeType(),
      state: this.getState()
    };

    if (eventLabels) {
      for (const key in eventLabels) {
        if (eventLabels.hasOwnProperty(key)) {
          event[key] = eventLabels[key];
        }
      }
    }

    this.callbackManager.callAll(event);
  }

  /**
   * Clamp a time value so it does not exceed the current range.
   * Clamps to near the end instead of the end itself to allow for devices that cannot seek to the very end of the media.
   * @param seconds The time value to clamp in seconds from the start of the media
   */
  protected getClampedTime(seconds: number): number {
    const range = this.getSeekableRange();
    const offsetFromEnd = this.getClampOffsetFromConfig();
    const nearToEnd = Math.max(range.end - offsetFromEnd, range.start);
    if (seconds < range.start) {
      return range.start;
    } else if (seconds > nearToEnd) {
      return nearToEnd;
    } else {
      return seconds;
    }
  }

  /**
   * Check whether a time value is near to the current media play time.
   * @param seconds The time value to test, in seconds from the start of the media
   */
  protected isNearToCurrentTime(seconds: number): boolean {
    const currentTime = this.getCurrentTime();
    const targetTime = this.getClampedTime(seconds);
    return Math.abs(currentTime - targetTime) <= this.CURRENT_TIME_TOLERANCE;
  }

  protected isLiveMedia() {
    return this.type === MediaPlayer.TYPE.LIVE_VIDEO || this.type === MediaPlayer.TYPE.LIVE_AUDIO;
  }

  private getClampOffsetFromConfig() {
    let clampOffsetFromEndOfRange: number;
    const config = RuntimeContext.getDevice().getConfig();
    if (config && config.streaming && config.streaming.overrides) {
      clampOffsetFromEndOfRange = config.streaming.overrides.clampOffsetFromEndOfRange;
    }

    if (clampOffsetFromEndOfRange !== undefined) {
      return clampOffsetFromEndOfRange;
    } else {
      return this.CLAMP_OFFSET_FROM_END_OF_RANGE;
    }
  }
}
