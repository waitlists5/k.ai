import React, { useState, useRef, useEffect } from 'react';
import { LandingPage } from './LandingPage';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SettingsPanel } from './SettingsPanel';
import { useChat } from '../hooks/useChat';
import { useTheme } from '../hooks/useTheme';

export const ChatInterface: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const {
    conversations,
    currentConversation,
    currentConversationId,
    settings,
    isLoading,
    setCurrentConversationId,
    createNewConversation,
    deleteConversation,
    sendMessage,
    editMessage,
    regenerateResponse,
    stopGeneration,
    updateSettings
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleStartChat = (message: string) => {
    setShowLanding(false);
    if (!currentConversation) {
      createNewConversation();
    }
    sendMessage(message);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setCurrentConversationId(null);
  };

  const handleNewChat = () => {
    createNewConversation();
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onStartChat={handleStartChat} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <ChatHeader
        onBack={handleBackToLanding}
        onOpenSettings={() => setShowSettings(true)}
        conversationTitle={currentConversation?.title}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {currentConversation && currentConversation.messages.length > 0 ? (
          <>
            <MessageList
              messages={currentConversation.messages}
              onEditMessage={editMessage}
              onRegenerateResponse={regenerateResponse}
              isLoading={isLoading}
            />
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Ask me anything to get started
              </p>
            </div>
          </div>
        )}

        <ChatInput
          onSendMessage={sendMessage}
          onStopGeneration={stopGeneration}
          isLoading={isLoading}
          onNewChat={handleNewChat}
          settings={settings}
          onUpdateSettings={updateSettings}
        />
      </div>

    </div>
  );
};