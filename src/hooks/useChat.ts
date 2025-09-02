import { useState, useCallback, useRef } from 'react';
import { Message, Conversation, ChatSettings } from '../types/chat';
import { openRouterAPI } from '../utils/openrouter';
import { storage } from '../utils/storage';

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => 
    storage.getConversations()
  );
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(() => storage.getSettings());
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const saveConversations = useCallback((newConversations: Conversation[]) => {
    setConversations(newConversations);
    storage.saveConversations(newConversations);
  }, []);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
    setCurrentConversationId(newConversation.id);
    return newConversation;
  }, [conversations, saveConversations]);

  const updateConversation = useCallback((conversationId: string, updates: Partial<Conversation>) => {
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId
        ? { ...conv, ...updates, updatedAt: new Date() }
        : conv
    );
    saveConversations(updatedConversations);
  }, [conversations, saveConversations]);

  const deleteConversation = useCallback((conversationId: string) => {
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    saveConversations(updatedConversations);
    
    if (currentConversationId === conversationId) {
      setCurrentConversationId(updatedConversations[0]?.id || null);
    }
  }, [conversations, currentConversationId, saveConversations]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Create conversation if none exists
    let conversation = currentConversation;
    if (!conversation) {
      conversation = createNewConversation();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true
    };

    // Update conversation with user message and loading assistant message
    const updatedMessages = [...conversation.messages, userMessage, assistantMessage];
    const title = conversation.messages.length === 0 
      ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
      : conversation.title;

    updateConversation(conversation.id, {
      messages: updatedMessages,
      title
    });

    setIsLoading(true);

    try {
      // Prepare messages for API
      const apiMessages = [
        { role: 'system' as const, content: settings.systemPrompt },
        ...updatedMessages.slice(0, -1).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      abortControllerRef.current = new AbortController();
      let responseContent = '';

      // Stream the response
      for await (const chunk of openRouterAPI.streamChat(apiMessages, {
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens
      })) {
        responseContent += chunk;
        
        // Update the assistant message with streaming content
        const currentMessages = [...updatedMessages];
        currentMessages[currentMessages.length - 1] = {
          ...assistantMessage,
          content: responseContent,
          isLoading: false
        };

        updateConversation(conversation.id, {
          messages: currentMessages
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication failed') || error.message.includes('API key')) {
          errorMessage = 'API authentication failed. Please check your OpenRouter API key in the environment variables.';
        } else if (error.message.includes('Rate limit')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
        } else if (error.message.includes('not configured')) {
          errorMessage = 'OpenRouter API key is not configured. Please set up your API key to use the chat feature.';
        }
      }
      
      // Update with error message
      const errorAssistantMessage = {
        ...assistantMessage,
        content: errorMessage,
        isLoading: false
      };

      const currentMessages = [...updatedMessages];
      currentMessages[currentMessages.length - 1] = errorAssistantMessage;

      updateConversation(conversation.id, {
        messages: currentMessages
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [currentConversation, createNewConversation, updateConversation, settings, isLoading]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (!currentConversation) return;

    const messageIndex = currentConversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Remove all messages after the edited message and update the content
    const updatedMessages = currentConversation.messages.slice(0, messageIndex + 1);
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent,
      isEditing: false
    };

    updateConversation(currentConversation.id, {
      messages: updatedMessages
    });

    // If it was a user message, regenerate the assistant response
    if (updatedMessages[messageIndex].role === 'user') {
      sendMessage(newContent);
    }
  }, [currentConversation, updateConversation, sendMessage]);

  const regenerateResponse = useCallback(() => {
    if (!currentConversation || currentConversation.messages.length < 2) return;

    const lastUserMessage = [...currentConversation.messages]
      .reverse()
      .find(m => m.role === 'user');

    if (lastUserMessage) {
      // Remove the last assistant message
      const updatedMessages = currentConversation.messages.filter(
        (_, index) => index !== currentConversation.messages.length - 1
      );

      updateConversation(currentConversation.id, {
        messages: updatedMessages
      });

      // Regenerate response
      sendMessage(lastUserMessage.content);
    }
  }, [currentConversation, updateConversation, sendMessage]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    storage.saveSettings(updatedSettings);
  }, [settings]);

  return {
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
  };
};