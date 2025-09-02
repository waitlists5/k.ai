import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { openRouterAPI } from '../utils/openrouter';

interface PromptEnhancerProps {
  originalPrompt: string;
  onEnhanced: (enhancedPrompt: string) => void;
}

export const PromptEnhancer: React.FC<PromptEnhancerProps> = ({ 
  originalPrompt, 
  onEnhanced 
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!originalPrompt.trim() || isEnhancing) return;

    setIsEnhancing(true);
    try {
      const enhanced = await openRouterAPI.enhancePrompt(originalPrompt);
      setEnhancedPrompt(enhanced);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAccept = () => {
    if (enhancedPrompt) {
      onEnhanced(enhancedPrompt);
      setEnhancedPrompt(null);
    }
  };

  const handleReject = () => {
    setEnhancedPrompt(null);
  };

  if (enhancedPrompt) {
    return (
      <div className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enhanced Prompt</span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border text-sm text-gray-800 dark:text-gray-200 mb-3">
          {enhancedPrompt}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
          >
            Use Enhanced
          </button>
          <button
            onClick={handleReject}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded transition-colors"
          >
            Keep Original
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnhance}
      disabled={!originalPrompt.trim() || isEnhancing}
      className="p-2 text-gray-400 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      title="Enhance prompt with AI"
    >
      {isEnhancing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
    </button>
  );
};