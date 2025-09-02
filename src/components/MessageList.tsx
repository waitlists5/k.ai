import React from 'react';
import { Message } from '../types/chat';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  onEditMessage: (messageId: string, newContent: string) => void;
  onRegenerateResponse: () => void;
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onEditMessage,
  onRegenerateResponse,
  isLoading
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          onEdit={onEditMessage}
          onRegenerate={index === messages.length - 1 && message.role === 'assistant' ? onRegenerateResponse : undefined}
          isLoading={isLoading && index === messages.length - 1}
        />
      ))}
    </div>
  );
};