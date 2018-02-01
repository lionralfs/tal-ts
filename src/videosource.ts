import { MediaSource } from './mediasource';

/**
 * An video media source. Provides storage of source and type information about an video media source.
 */
export class VideoSource extends MediaSource {
  /**
   * Get the media type of this source. In this case `MediaType.MEDIA_TYPE_VIDEO`.
   * Returns the media type of this content.
   */
  public getMediaType(): number {
    return MediaSource.MEDIA_TYPE_VIDEO;
  }
}
