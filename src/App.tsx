import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/Auth/AuthModal';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ChatArea } from './components/Chat/ChatArea';
import { ModeSelectionModal } from './components/Chat/ModeSelectionModal';
import { useChat } from './hooks/useChat';
import { ConversionSettings } from './types';

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    chats,
    activeChat,
    isLoading: chatLoading,
    createNewChat,
    sendMessage,
    selectChat,
    deleteChat,
  } = useChat();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
    inputMode: 'text',
    outputMode: 'visual',
    instantMode: false,
  });
  const [instantModeActive, setInstantModeActive] = useState(false);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [authLoading, isAuthenticated]);

  const handleNewChat = () => {
    if (instantModeActive) {
      setInstantModeActive(false);
    }
    setShowModeSelection(true);
  };

  const handleModeConfirm = (settings: ConversionSettings) => {
    setConversionSettings(settings);
    if (!settings.instantMode) {
      createNewChat(settings);
    }
    setInstantModeActive(settings.instantMode);
  };

  const handleSendMessage = (content: string, type: 'text' | 'audio' | 'visual') => {
    if (instantModeActive || activeChat) {
      sendMessage(content, type, conversionSettings);
    }
  };

  const handleInstantMode = () => {
    setInstantModeActive(true);
    setConversionSettings({
      inputMode: 'text',
      outputMode: 'text',
      instantMode: true,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          chats={chats}
          activeChat={activeChat}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onInstantMode={handleInstantMode}
          instantModeActive={instantModeActive}
        />

        <main className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          {activeChat || instantModeActive ? (
            <ChatArea
              messages={activeChat?.messages || []}
              onSendMessage={handleSendMessage}
              conversionSettings={conversionSettings}
              isLoading={chatLoading}
              instantMode={instantModeActive}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <img src="/images/Logo.png" alt="Gesture Path" className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to Gesture Path
                </h1>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleNewChat}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Start New Conversion
                  </button>
                  <button
                    onClick={handleInstantMode}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Try Instant Mode
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ModeSelectionModal
        isOpen={showModeSelection}
        onClose={() => setShowModeSelection(false)}
        onConfirm={handleModeConfirm}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;