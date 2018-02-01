import { MediaSource } from './mediasource';

/**
 * * An audio media source. Provides storage of source and type information about an audio media source.
 */
export class AudioSource extends MediaSource {
  /**
   * Get the media type of this source. In this case `MediaType.MEDIA_TYPE_AUDIO`.
   * Returns the media type of this content.
   */
  public getMediaType(): number {
    return MediaSource.MEDIA_TYPE_AUDIO;
  }
}
