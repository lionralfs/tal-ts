import { BaseClass } from './class';
import { RuntimeContext } from './runtimecontext';
import { URLBuilder } from './urlbuilder';

export interface IMediaSource {
  src: string;
  type: string;
}

/**
 * Base MediaSource (of unknown type). Provides storage of source and type information about a media source.
 */
export class MediaSource extends BaseClass {
  /**
   * Unknown media type.
   */
  public static MEDIA_TYPE_UNKNOWN = 0;

  /**
   * Video media type.
   */
  public static MEDIA_TYPE_VIDEO = 1;

  /**
   * Audio media type.
   */
  public static MEDIA_TYPE_AUDIO = 2;

  /**
   * Returns Given a content type, returns if it refers to a live stream.
   *
   * @param type The type of the media.
   *
   * Returns `true` if the given type refers to a live stream.
   */
  public static isLiveStream(type: string): boolean {
    return type.toLowerCase() === 'application/vnd.apple.mpegurl';
  }

  private src: string;
  private type: string;

  /**
   * Create a new MediaSource.
   * @param src The URI of the media.
   * @param type The type of the media.
   */
  constructor(src: string, type: string) {
    super();

    this.src = src;
    this.type = type;
  }

  /**
   * Check if this MediaSource is equal to another.
   *
   * Returns `true` if the provided mediaSource is equal to this. Otherwise `false`.
   * @param mediaSource A MediaSource object to compare this one to.
   */
  public isEqual(mediaSource: IMediaSource): boolean {
    return this.src === mediaSource.src && this.type === mediaSource.type;
  }

  /**
   * Check to see if this media source refers to a live stream.
   *
   * Returns `true` if this is a live stream. Otherwise `false`.
   */
  public isLiveStream(): boolean {
    return MediaSource.isLiveStream(this.type);
  }

  /**
   * Get the URL of this stream, built from the known source, config-provided template, and tag replacement.
   *
   * @param tags A associative array of tags (%tag%) and values to replace in the URL.
   *
   * Returns the URL of this source.
   */
  public getURL(tags?: { [key: string]: string }) {
    const tagsObj = tags || {};

    const config = RuntimeContext.getCurrentApplication()
      .getDevice()
      .getConfig();
    const streamingConfig =
      this.getMediaType() === MediaSource.MEDIA_TYPE_AUDIO ? config.streaming.audio : config.streaming.video;

    return new URLBuilder(streamingConfig.mediaURIFormat).getURL(this.src, tagsObj);
  }

  /**
   * Get the content type of this source.
   * Returns the content type (MIME type) of this source.
   */
  public getContentType(): string {
    return this.type;
  }

  /**
   * Get the media type of this source. Either  <code>MediaType.MEDIA_TYPE_UNKNOWN</code>, <code>MediaType.MEDIA_TYPE_AUDIO</code> or <code>MediaType.MEDIA_TYPE_VIDEO</code>.
   * Returns the media type of this content.
   */
  public getMediaType(): number {
    return MediaSource.MEDIA_TYPE_UNKNOWN;
  }
}
