import LinkedInAdapter from "./adapters/LinkedInAdapter";
import MetaAdapter from "./adapters/MetaAdapter";
import TwitterAdapter from "./adapters/TwitterAdapter";
import YouTubeAdapter from "./adapters/YouTubeAdapter";

const adapters = {
  linkedin: new LinkedInAdapter(),
  facebook: new MetaAdapter("facebook"),
  instagram: new MetaAdapter("instagram"),
  twitter: new TwitterAdapter(),
  youtube: new YouTubeAdapter(),
};

/**
 * Returns the adapter instance for a given social provider.
 * @param {string} provider - 'linkedin' | 'facebook' | 'instagram' | 'twitter' | 'youtube'
 */
export function getAdapter(provider) {
  const adapter = adapters[provider?.toLowerCase()];
  if (!adapter) {
    throw new Error(`Unsupported social provider: ${provider}`);
  }
  return adapter;
}

/**
 * Returns list of all available provider metadata for the UI.
 */
export function getSupportedProviders() {
  return [
    {
      id: "linkedin",
      name: "LinkedIn",
      charLimit: 3000,
      requiresMedia: false,
      color: "#0A66C2",
      icon: "linkedin",
    },
    {
      id: "facebook",
      name: "Facebook Page",
      charLimit: 63206,
      requiresMedia: false,
      color: "#1877F2",
      icon: "facebook",
    },
    {
      id: "instagram",
      name: "Instagram",
      charLimit: 2200,
      requiresMedia: true,
      color: "#E4405F",
      icon: "instagram",
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      charLimit: 280,
      requiresMedia: false,
      color: "#000000",
      icon: "twitter",
    },
    {
      id: "youtube",
      name: "YouTube Community",
      charLimit: 5000,
      requiresMedia: false,
      color: "#FF0000",
      icon: "youtube",
    },
  ];
}
