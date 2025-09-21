import React from 'react';
import { User, Bot, Clock, Eye, Volume2, Type } from 'lucide-react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const getTypeIcon = () => {
    switch (message.type) {
      case 'visual':
        return <Eye size={14} />;
      case 'audio':
        return <Volume2 size={14} />;
      case 'text':
        return <Type size={14} />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (message.type) {
      case 'visual':
        return 'text-green-600 dark:text-green-400';
      case 'audio':
        return 'text-blue-600 dark:text-blue-400';
      case 'text':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-600 dark:bg-gray-700 text-white'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
      </div>

      <div className={`max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
        }`}>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {message.metadata && (
            <div className={`mt-2 pt-2 border-t text-xs opacity-75 ${
              isUser ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}>
              {message.metadata.originalMode && message.metadata.targetMode && (
                <div className="flex items-center gap-1 mb-1">
                  <span className="capitalize">{message.metadata.originalMode}</span>
                  <span>→</span>
                  <span className="capitalize">{message.metadata.targetMode}</span>
                </div>
              )}
              {message.metadata.processingTime && (
                <div className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>{message.metadata.processingTime}ms</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
          {message.type && (
            <div className={`flex items-center gap-1 ${getTypeColor()}`}>
              {getTypeIcon()}
              <span className="capitalize">{message.type}</span>
            </div>
          )}
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};