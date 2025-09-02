import { Conversation, ChatSettings } from '../types/chat';

const CONVERSATIONS_KEY = 'ai-chat-conversations';
const SETTINGS_KEY = 'ai-chat-settings';
const THEME_KEY = 'ai-chat-theme';

export const storage = {
  // Conversations
  getConversations(): Conversation[] {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveConversations(conversations: Conversation[]): void {
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  },

  // Settings
  getSettings(): ChatSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {
        model: 'meta-llama/llama-3.1-70b-instruct:free',
        temperature: 0.7,
        maxTokens: 4000,
        systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.'
      };
    } catch {
      return {
        model: 'meta-llama/llama-3.1-70b-instruct:free',
        temperature: 0.7,
        maxTokens: 4000,
        systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.'
      };
    }
  },

  saveSettings(settings: ChatSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Theme
  getTheme(): 'light' | 'dark' {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return stored as 'light' | 'dark';
      
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  },

  saveTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }
};