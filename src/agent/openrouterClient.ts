import { Intent } from './intentSchema';

// TODO: Replace with your OpenRouter API key from Netlify env vars
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || OPENROUTER_API_KEY;
  }

  async parseIntent(userText: string): Promise<Intent> {
    // TODO: Remove this mock when API key is added
    if (!this.apiKey) {
      return this.mockParseIntent(userText);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Assistant App'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that parses user input and returns structured intents.
              
              Analyze the user's text and return a JSON object with this exact structure:
              {
                "type": "task|calendar|journal|navigation|mood|weather|affirmation|unknown",
                "confidence": 0.0-1.0,
                "data": { /* relevant extracted data */ }
              }
              
              For tasks: extract title, description, priority (low/medium/high), dueDate, tags
              For calendar: extract title, date, time, duration, description
              For journal: extract content, mood (1-5), tags, therapeutic prompts
              For navigation: extract destination (dashboard|tasks|calendar|journal|hands|settings)
              For mood: extract rating (1-5) and notes
              
              Return only valid JSON, no other text.`
            },
            {
              role: 'user',
              content: userText
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenRouter');
      }

      return JSON.parse(content) as Intent;
    } catch (error) {
      console.error('OpenRouter API error:', error);
      return this.mockParseIntent(userText);
    }
  }

  private mockParseIntent(text: string): Intent {
    const lowerText = text.toLowerCase();
    
    // Navigation intents
    if (lowerText.includes('dashboard') || lowerText.includes('home')) {
      return { type: 'navigation', confidence: 0.9, data: { destination: 'dashboard' } };
    }
    if (lowerText.includes('task') || lowerText.includes('todo')) {
      if (lowerText.includes('show') || lowerText.includes('go to') || lowerText.includes('open')) {
        return { type: 'navigation', confidence: 0.9, data: { destination: 'tasks' } };
      }
      return { 
        type: 'task', 
        confidence: 0.8, 
        data: { 
          action: lowerText.includes('complete') ? 'complete' : 'create',
          title: text.replace(/add|create|new|task|todo/gi, '').trim() || 'New task',
          priority: lowerText.includes('urgent') || lowerText.includes('important') ? 'high' : 'medium'
        } 
      };
    }
    if (lowerText.includes('calendar') || lowerText.includes('schedule') || lowerText.includes('meeting')) {
      if (lowerText.includes('show') || lowerText.includes('go to') || lowerText.includes('open')) {
        return { type: 'navigation', confidence: 0.9, data: { destination: 'calendar' } };
      }
      return { 
        type: 'calendar', 
        confidence: 0.8, 
        data: { 
          action: 'create',
          title: text.replace(/schedule|meeting|calendar/gi, '').trim() || 'New event'
        } 
      };
    }
    if (lowerText.includes('journal') || lowerText.includes('write') || lowerText.includes('reflect')) {
      if (lowerText.includes('show') || lowerText.includes('go to') || lowerText.includes('open')) {
        return { type: 'navigation', confidence: 0.9, data: { destination: 'journal' } };
      }
      return { 
        type: 'journal', 
        confidence: 0.8, 
        data: { 
          action: 'create',
          content: text,
          mood: 3
        } 
      };
    }

    // Mood intents
    if (lowerText.includes('feeling') || lowerText.includes('mood')) {
      const moodWords = {
        'terrible': 1, 'awful': 1, 'sad': 2, 'down': 2, 'okay': 3, 'fine': 3,
        'good': 4, 'great': 4, 'amazing': 5, 'fantastic': 5, 'excellent': 5
      };
      
      let mood = 3;
      for (const [word, rating] of Object.entries(moodWords)) {
        if (lowerText.includes(word)) {
          mood = rating;
          break;
        }
      }
      
      return { 
        type: 'mood', 
        confidence: 0.9, 
        data: { rating: mood, notes: text } 
      };
    }

    return { type: 'unknown', confidence: 0.1, data: { text } };
  }
}

export const openrouterClient = new OpenRouterClient();