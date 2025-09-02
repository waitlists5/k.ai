import React from 'react';
import { ArrowLeft, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ChatHeaderProps {
  onBack: () => void;
  onOpenSettings: () => void;
  conversationTitle?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onBack, 
  onOpenSettings, 
  conversationTitle 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">k.ai</h1>
            {conversationTitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-48">
                {conversationTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>
  );
};