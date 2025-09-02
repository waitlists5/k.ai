import React, { useState } from 'react';
import { ArrowUp, Mic, Settings, Moon, Sun, Lightbulb, Code, Search, Wand2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface LandingPageProps {
  onStartChat: (message: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const [message, setMessage] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onStartChat(message.trim());
    }
  };

  const suggestions = [
    { icon: Lightbulb, text: 'AI Slides', description: 'Create presentations' },
    { icon: Code, text: 'Full-Stack', description: 'Build applications' },
    { icon: Wand2, text: 'Magic Design', description: 'Design interfaces' },
    { icon: Code, text: 'Write code', description: 'Programming help' },
    { icon: Search, text: 'Search info', description: 'Research topics' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">k.ai</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign in
            </button>
            <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-br from-orange-400 to-red-500 bg-clip-text text-transparent">K</span>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4">
            Hi, I'm <span className="font-medium">k.ai</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            How can I help you today?
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-2xl mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask k.ai anything"
                className="w-full px-6 py-4 pr-20 text-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              
              <div className="absolute right-3 flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Voice input"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion.text)}
                className="group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
                    <suggestion.icon className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {suggestion.text}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {suggestion.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Tech blog
          </a>
          <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Contact us
          </a>
          <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Terms of Service
          </a>
          <span>and</span>
          <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
};