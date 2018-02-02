import { MediaPlayer, MediaPlayerState, MediaPlayerType } from './mediaplayer';
/**
 * Main MediaPlayer implementation for HTML5 devices.
 * Use this device modifier if a device implements the HTML5 media playback standard.
 * It must support creation of `video` and `audio` elements, and those objects must expose an
 * API in accordance with the HTML5 media specification.
 */
export declare class HTML5MediaPlayer extends MediaPlayer {
    private trustZeroes;
    private ignoreNextPauseEvent;
    private source;
    private mimeType;
    private mediaElement;
    private sourceElement;
    private lastSentinelTime;
    private sentinelInterval;
    private sentinelIntervalNumber;
    private hasSentinelTimeChangedWithinTolerance;
    private nearEndOfMedia;
    private sentinelLimits;
    private targetSeekTime;
    private sentinelSeekTime;
    private readyToPlayFrom;
    private seekSentinelTolerance;
    private enterBufferingSentinelAttemptCount;
    private postBufferingState;
    constructor();
    setSource(mediaType: MediaPlayerType, url: string, mimeType: string): void;
    playFrom(seconds: number): void;
    beginPlayback(): void;
    beginPlaybackFrom(seconds: number): void;
    pause(): void;
    resume(): void;
    stop(): void;
    reset(): void;
    getSource(): string;
    getMimeType(): string;
    getCurrentTime(): number;
    getState(): MediaPlayerState;
    getPlayerElement(): HTMLMediaElement;
    getMediaDuration(): number;
    getSeekableRange(): {
        start: number;
        end: number;
    };
    private getSeekableRangeFromElement();
    private onFinishedBuffering();
    private pauseMediaElement();
    private onPause();
    private onDeviceError();
    private onSourceError();
    private onDeviceBuffering();
    private onEndOfMedia();
    private onStatus();
    private onMetadata();
    private exitBuffering();
    private metadataLoaded();
    private playFromIfReady();
    private waitingToPlayFrom();
    private deferredPlayFrom();
    private seekTo(seconds);
    private wrapOnFinishedBuffering();
    private wrapOnError();
    private wrapOnEndOfMedia();
    private wrapOnDeviceBuffering();
    private wrapOnStatus();
    private wrapOnMetadata();
    private wrapOnSourceError();
    private wrapOnPause();
    private getClampedTimeForPlayFrom(seconds);
    private wipe();
    private destroyMediaElement();
    private unloadMediaSrc();
    private generateSourceElement(url, mimeType);
    private reportError(errorMessage);
    private toStopped();
    private toBuffering();
    private toPlaying();
    private toPaused();
    private toComplete();
    private toEmpty();
    private toError(errorMessage);
    private clearSentinels();
    private setSentinels(sentinels);
    private setSentinelLimits();
    private enterBufferingSentinel();
    private exitBufferingSentinel();
    private shouldBeSeekedSentinel();
    private shouldBePausedSentinel();
    private nextSentinelAttempt(sentinelInfo, attemptFn);
    private endOfMediaSentinel();
    private isReadyToPlayFrom();
    private setSeekSentinelTolerance();
}
