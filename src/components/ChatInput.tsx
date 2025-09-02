import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, Plus, Mic } from 'lucide-react';
import { PromptEnhancer } from './PromptEnhancer';
import { SettingsPanel } from './SettingsPanel';
import { ChatSettings } from '../types/chat';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStopGeneration: () => void;
  onNewChat: () => void;
  isLoading: boolean;
  settings: ChatSettings;
  onUpdateSettings: (settings: ChatSettings) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopGeneration,
  onNewChat,
  isLoading,
  settings,
  onUpdateSettings
}) => {
  const [message, setMessage] = useState('');
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      setShowEnhancer(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEnhancedPrompt = (enhancedPrompt: string) => {
    setMessage(enhancedPrompt);
    setShowEnhancer(false);
    textareaRef.current?.focus();
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {showEnhancer && (
            <PromptEnhancer
              originalPrompt={message}
              onEnhanced={handleEnhancedPrompt}
            />
          )}
          
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={onNewChat}
                className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                title="New chat"
              >
                <Plus className="h-5 w-5" />
              </button>

              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask k.ai anything..."
                  className="w-full px-4 py-3 pr-20 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  rows={1}
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                />
                
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEnhancer(!showEnhancer)}
                    className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Enhance prompt"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  
                  {isLoading ? (
                    <button
                      type="button"
                      onClick={onStopGeneration}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                      title="Stop generation"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                      title="Send message"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <SettingsPanel
        settings={settings}
        onSave={onUpdateSettings}
        onClose={() => setShowSettings(false)}
        isOpen={showSettings}
      />
    </div>
  );
};