import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, Image, StopCircle } from 'lucide-react';
import { ConversionMode } from '../../types';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'audio' | 'visual') => void;
  inputMode: ConversionMode;
  isLoading: boolean;
  instantMode: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  inputMode,
  isLoading,
  instantMode,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Handle file upload based on inputMode
      const fileType = inputMode === 'visual' ? 'visual' : inputMode === 'audio' ? 'audio' : 'text';
      onSendMessage(`[File: ${file.name}]`, fileType);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // TODO: Stop recording and process audio
      setIsRecording(false);
      onSendMessage('[Audio Recording]', 'audio');
    } else {
      // TODO: Start recording
      setIsRecording(true);
    }
  };

  const getInputPlaceholder = () => {
    switch (inputMode) {
      case 'visual':
        return  'Upload an image/video...';
      case 'audio':
        return 'Upload record/upload audio...';
      case 'text':
        return 'Type your message here...';
      default:
        return 'Type your message...';
    }
  };

  return (
    <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (instantMode && e.target.value.trim()) {
                  // TODO: Trigger instant conversion
                }
              }}
              placeholder={getInputPlaceholder()}
              className="w-full resize-none rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 max-h-32"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {inputMode !== 'text' && (
            <div className="flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept={inputMode === 'visual' ? 'image/*,video/*' : inputMode === 'audio' ? 'audio/*' : '*/*'}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Upload file"
              >
                {inputMode === 'visual' ? <Image size={20} /> : <Paperclip size={20} />}
              </button>

              {inputMode === 'audio' && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording
                      ? 'text-red-500 bg-red-100 dark:bg-red-900/20'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {instantMode && (
        <div className="mt-2 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Instant mode active - converting as you type
        </div>
      )}
    </div>
  );
};