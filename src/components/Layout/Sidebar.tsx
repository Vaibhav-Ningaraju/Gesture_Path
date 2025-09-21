import React from 'react';
import { MessageSquare, X, Trash2, Edit3, Zap } from 'lucide-react';
import { Chat } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
  onInstantMode: () => void;
  instantModeActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  chats,
  activeChat,
  onSelectChat,
  onDeleteChat,
  onInstantMode,
  instantModeActive,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-80 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700 z-50 lg:relative lg:z-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Conversations</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={onInstantMode}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              instantModeActive
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            } border dark:border-gray-600`}
          >
            <Zap size={18} />
            <span className="font-medium">Instant Conversion</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a new chat to begin</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat?.id === chat.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => onSelectChat(chat)}
                >
                  <MessageSquare size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{chat.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit functionality
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};