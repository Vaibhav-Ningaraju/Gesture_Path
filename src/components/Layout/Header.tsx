import React from 'react';
import { Menu, Plus, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  onNewChat, 
  isSidebarOpen 
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-3">
            <img src="/images/Logo.png" alt="Gesture Path" className="w-8 h-8 rounded-lg" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Gesture Path
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New chat</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <User size={20} />
              <span className="hidden sm:inline">{user?.name}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-10">
                <button className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};