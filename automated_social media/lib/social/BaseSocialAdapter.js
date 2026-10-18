/**
 * Base abstract interface for all social media provider adapters.
 */
export default class BaseSocialAdapter {
  constructor(providerName) {
    this.providerName = providerName;
  }

  /**
   * Generates the OAuth authorization URL to initiate account connection.
   * @param {string} state - CSRF state token
   * @param {string} redirectUri - OAuth redirect callback URL
   * @returns {string} The platform authorization URL
   */
  getAuthUrl(state, redirectUri) {
    throw new Error(`getAuthUrl not implemented for ${this.providerName}`);
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   * @param {string} code - The OAuth authorization code
   * @param {string} redirectUri - The callback redirect URL used during auth
   * @returns {Promise<{accessToken: string, refreshToken: string, expiresIn: number, accountId: string, accountName: string, metadata: object}>}
   */
  async handleCallback(code, redirectUri) {
    throw new Error(`handleCallback not implemented for ${this.providerName}`);
  }

  /**
   * Refreshes an expired access token using the refresh token.
   * @param {object} socialAccount - The SocialAccount record
   * @returns {Promise<{accessToken: string, refreshToken: string, expiresIn: number}>}
   */
  async refreshToken(socialAccount) {
    throw new Error(`refreshToken not implemented for ${this.providerName}`);
  }

  /**
   * Validates the post text and media constraints for this platform.
   * @param {string} text - The post content text
   * @param {string|null} mediaUrl - The media URL or file reference
   * @returns {{isValid: boolean, error: string|null}}
   */
  validate(text, mediaUrl) {
    return { isValid: true, error: null };
  }

  /**
   * Publishes the post to the social media network.
   * @param {object} params
   * @param {string} params.text - Post text content
   * @param {string|null} params.mediaUrl - Image or media URL
   * @param {string} params.accessToken - Plaintext decrypted access token
   * @param {object} params.socialAccount - The SocialAccount DB record
   * @returns {Promise<{success: boolean, externalPostId: string, url: string}>}
   */
  async publish({ text, mediaUrl, accessToken, socialAccount }) {
    throw new Error(`publish not implemented for ${this.providerName}`);
  }
}
