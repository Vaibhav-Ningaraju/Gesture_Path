import { useState, useCallback } from 'react';
import { Chat, Message, ConversionSettings } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useChat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = useCallback((conversionSettings: ConversionSettings) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `${conversionSettings.inputMode} to ${conversionSettings.outputMode}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      messages: [],
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    
    // TODO: Save to backend
    // await saveChat(newChat);
    
    return newChat;
  }, [user]);

  const sendMessage = useCallback(async (
    content: string, 
    type: 'text' | 'audio' | 'visual',
    conversionSettings: ConversionSettings
  ) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      type,
      metadata: {
        originalMode: conversionSettings.inputMode,
        targetMode: conversionSettings.outputMode,
      },
    };

    // Add user message
    setActiveChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date().toISOString(),
    } : null);

    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, messages: [...chat.messages, userMessage], updatedAt: new Date().toISOString() }
        : chat
    ));

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          content,
          inputMode: conversionSettings.inputMode,
          outputMode: conversionSettings.outputMode,
          instantMode: conversionSettings.instantMode,
        }),
      });

      const result = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.convertedContent || 'Conversion completed!',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        type: conversionSettings.outputMode,
        metadata: {
          originalMode: conversionSettings.inputMode,
          targetMode: conversionSettings.outputMode,
          processingTime: result.processingTime,
        },
      };

      // Add assistant message
      setActiveChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, assistantMessage],
        updatedAt: new Date().toISOString(),
      } : null);

      setChats(prev => prev.map(chat => 
        chat.id === activeChat.id 
          ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: new Date().toISOString() }
          : chat
      ));

    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error - maybe show a toast notification
    } finally {
      setIsLoading(false);
    }
  }, [activeChat]);

  const selectChat = useCallback((chat: Chat) => {
    setActiveChat(chat);
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
    
    // TODO: Delete from backend
    // await deleteChat(chatId);
  }, [activeChat]);

  return {
    chats,
    activeChat,
    isLoading,
    createNewChat,
    sendMessage,
    selectChat,
    deleteChat,
    setActiveChat,
  };
};