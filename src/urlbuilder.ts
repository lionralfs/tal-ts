import { BaseClass } from './class';

/**
 * Class to build media URLs from various models
 */
export class URLBuilder extends BaseClass {
  private urlTemplate: string;

  /**
   * @param urlTemplate The URL template from which to build URLs
   */
  constructor(urlTemplate: string) {
    super();
    this.urlTemplate = urlTemplate;
  }

  /**
   * Build a URL for a given set of tags.
   *
   * @param href The URL to modify.
   * @param tags An object containing additional tags to replace.
   *
   * Returns a URL built from the template and the passed values.
   */
  public getURL(href: string, tags: { [key: string]: string }): string {
    let url = this.urlTemplate.replace(/^%href%/, href);

    url = url.replace(/%[a-z]+%/g, match => {
      const v = tags[match];
      if (v !== undefined) {
        return v;
      }
      return match;
    });

    return encodeURI(url).replace(/'/g, '%27');
  }
}
