// TODO: Plugin System Placeholders for Future APIs
// Add API keys as Netlify environment variables:
// VITE_SPOTIFY_CLIENT_ID, VITE_GMAIL_API_KEY, VITE_NOTION_API_KEY, etc.

export interface Plugin {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  category: 'music' | 'email' | 'productivity' | 'social' | 'finance' | 'health';
}

export const availablePlugins: Plugin[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Control music playback and playlists',
    enabled: false,
    icon: '🎵',
    category: 'music'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Read and send emails',
    enabled: false,
    icon: '📧',
    category: 'email'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync with Notion databases',
    enabled: false,
    icon: '📝',
    category: 'productivity'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages and check status',
    enabled: false,
    icon: '💬',
    category: 'social'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Monitor payments and revenue',
    enabled: false,
    icon: '💳',
    category: 'finance'
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    description: 'Track fitness and health metrics',
    enabled: false,
    icon: '⌚',
    category: 'health'
  }
];

// TODO: Spotify Integration
export const spotifyService = {
  // TODO: Add VITE_SPOTIFY_CLIENT_ID to Netlify env vars
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '',
  
  async getCurrentTrack() {
    // TODO: Implement Spotify Web API integration
    return {
      name: 'Sample Track',
      artist: 'Sample Artist',
      isPlaying: false
    };
  },
  
  async playPause() {
    // TODO: Implement play/pause functionality
    console.log('Spotify: Play/Pause triggered');
  },
  
  async nextTrack() {
    // TODO: Implement next track functionality
    console.log('Spotify: Next track');
  }
};

// TODO: Gmail Integration
export const gmailService = {
  // TODO: Add VITE_GMAIL_API_KEY to Netlify env vars
  apiKey: import.meta.env.VITE_GMAIL_API_KEY || '',
  
  async getUnreadCount() {
    // TODO: Implement Gmail API integration
    return 5; // Mock data
  },
  
  async getRecentEmails(count: number = 5) {
    // TODO: Implement Gmail API integration
    return [
      {
        id: '1',
        subject: 'Sample Email',
        sender: 'example@gmail.com',
        snippet: 'This is a sample email...',
        date: new Date()
      }
    ];
  }
};

// TODO: Notion Integration
export const notionService = {
  // TODO: Add VITE_NOTION_API_KEY to Netlify env vars
  apiKey: import.meta.env.VITE_NOTION_API_KEY || '',
  
  async getDatabases() {
    // TODO: Implement Notion API integration
    return [];
  },
  
  async createPage(databaseId: string, properties: any) {
    // TODO: Implement Notion page creation
    console.log('Notion: Create page', { databaseId, properties });
  }
};

// TODO: Slack Integration
export const slackService = {
  // TODO: Add VITE_SLACK_BOT_TOKEN to Netlify env vars
  botToken: import.meta.env.VITE_SLACK_BOT_TOKEN || '',
  
  async sendMessage(channel: string, text: string) {
    // TODO: Implement Slack Web API integration
    console.log('Slack: Send message', { channel, text });
  },
  
  async getChannels() {
    // TODO: Implement Slack channels list
    return [];
  }
};

// TODO: Stripe Integration
export const stripeService = {
  // TODO: Add VITE_STRIPE_PUBLISHABLE_KEY to Netlify env vars
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  async getRecentPayments() {
    // TODO: Implement Stripe API integration
    return [];
  },
  
  async getDailyRevenue() {
    // TODO: Implement Stripe revenue analytics
    return { amount: 0, currency: 'usd' };
  }
};

// TODO: Fitbit Integration
export const fitbitService = {
  // TODO: Add VITE_FITBIT_CLIENT_ID to Netlify env vars
  clientId: import.meta.env.VITE_FITBIT_CLIENT_ID || '',
  
  async getStepCount() {
    // TODO: Implement Fitbit Web API integration
    return 8500; // Mock data
  },
  
  async getHeartRate() {
    // TODO: Implement heart rate data
    return { current: 72, resting: 68 };
  }
};

export const pluginService = {
  getEnabledPlugins: () => availablePlugins.filter(p => p.enabled),
  
  enablePlugin: (pluginId: string) => {
    const plugin = availablePlugins.find(p => p.id === pluginId);
    if (plugin) {
      plugin.enabled = true;
      // TODO: Save to user preferences in Firebase
      console.log(`Plugin ${pluginId} enabled`);
    }
  },
  
  disablePlugin: (pluginId: string) => {
    const plugin = availablePlugins.find(p => p.id === pluginId);
    if (plugin) {
      plugin.enabled = false;
      // TODO: Save to user preferences in Firebase
      console.log(`Plugin ${pluginId} disabled`);
    }
  }
};