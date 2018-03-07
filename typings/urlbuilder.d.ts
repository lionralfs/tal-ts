import { BaseClass } from './class';
/**
 * Class to build media URLs from various models
 */
export declare class URLBuilder extends BaseClass {
    private urlTemplate;
    /**
     * @param urlTemplate The URL template from which to build URLs
     */
    constructor(urlTemplate: string);
    /**
     * Build a URL for a given set of tags.
     *
     * @param href The URL to modify.
     * @param tags An object containing additional tags to replace.
     *
     * Returns a URL built from the template and the passed values.
     */
    getURL(href: string, tags: {
        [key: string]: string;
    }): string;
}
