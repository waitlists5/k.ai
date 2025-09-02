import React from 'react';
import { Message as MessageType } from '../types/chat';
import { MessageContent } from './MessageContent';

interface MessageProps {
  message: MessageType;
  onEdit?: (messageId: string, newContent: string) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onEdit }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          message.role === 'user'
            ? 'bg-orange-500 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <MessageContent content={message.content} />
        
        {message.isLoading && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs text-gray-500">Thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
};