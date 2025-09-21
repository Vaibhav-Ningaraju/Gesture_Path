import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Message, ConversionSettings } from '../../types';
import { Bot, Sparkles } from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string, type: 'text' | 'audio' | 'visual') => void;
  conversionSettings: ConversionSettings;
  isLoading: boolean;
  instantMode: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  conversionSettings,
  isLoading,
  instantMode,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0 && !instantMode) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Convert
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Converting from <span className="font-medium capitalize">{conversionSettings.inputMode}</span> to{' '}
              <span className="font-medium capitalize">{conversionSettings.outputMode}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start by sending a message or uploading content to begin the conversion process.
            </p>
          </div>
        </div>
        <ChatInput
          onSendMessage={onSendMessage}
          inputMode={conversionSettings.inputMode}
          isLoading={isLoading}
          instantMode={conversionSettings.instantMode}
        />
      </div>
    );
  }

  if (instantMode && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Instant Conversion Mode
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Real-time conversion
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Type or record content for immediate conversion.
            </p>
          </div>
        </div>
        <ChatInput
          onSendMessage={onSendMessage}
          inputMode="text"
          isLoading={isLoading}
          instantMode={true}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        onSendMessage={onSendMessage}
        inputMode={instantMode ? 'text' : conversionSettings.inputMode}
        isLoading={isLoading}
        instantMode={conversionSettings.instantMode || instantMode}
      />
    </div>
  );
};