import { BaseClass } from './class';
export interface IMediaSource {
    src: string;
    type: string;
}
/**
 * Base MediaSource (of unknown type). Provides storage of source and type information about a media source.
 */
export declare class MediaSource extends BaseClass {
    /**
     * Unknown media type.
     */
    static MEDIA_TYPE_UNKNOWN: number;
    /**
     * Video media type.
     */
    static MEDIA_TYPE_VIDEO: number;
    /**
     * Audio media type.
     */
    static MEDIA_TYPE_AUDIO: number;
    /**
     * Returns Given a content type, returns if it refers to a live stream.
     *
     * @param type The type of the media.
     *
     * Returns `true` if the given type refers to a live stream.
     */
    static isLiveStream(type: string): boolean;
    private src;
    private type;
    /**
     * Create a new MediaSource.
     * @param src The URI of the media.
     * @param type The type of the media.
     */
    constructor(src: string, type: string);
    /**
     * Check if this MediaSource is equal to another.
     *
     * Returns `true` if the provided mediaSource is equal to this. Otherwise `false`.
     * @param mediaSource A MediaSource object to compare this one to.
     */
    isEqual(mediaSource: IMediaSource): boolean;
    /**
     * Check to see if this media source refers to a live stream.
     *
     * Returns `true` if this is a live stream. Otherwise `false`.
     */
    isLiveStream(): boolean;
    /**
     * Get the URL of this stream, built from the known source, config-provided template, and tag replacement.
     *
     * @param tags A associative array of tags (%tag%) and values to replace in the URL.
     *
     * Returns the URL of this source.
     */
    getURL(tags?: {
        [key: string]: string;
    }): string;
    /**
     * Get the content type of this source.
     * Returns the content type (MIME type) of this source.
     */
    getContentType(): string;
    /**
     * Get the media type of this source. Either  `MediaType.MEDIA_TYPE_UNKNOWN`,
     * `MediaType.MEDIA_TYPE_AUDIO` or `MediaType.MEDIA_TYPE_VIDEO`.
     * Returns the media type of this content.
     */
    getMediaType(): number;
}
