import React, { useState } from 'react';
import { X, Eye, Volume2, Type, ArrowRight, Zap } from 'lucide-react';
import { ConversionMode, ConversionSettings } from '../../types';

interface ModeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: ConversionSettings) => void;
}

const modes = [
  {
    id: 'visual' as ConversionMode,
    name: 'Visual/Animation',
    description: 'Images, videos, animations, and visual content',
    icon: Eye,
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'audio' as ConversionMode,
    name: 'Audio',
    description: 'Voice recordings, music, and sound files',
    icon: Volume2,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'text' as ConversionMode,
    name: 'Text',
    description: 'Written content and textual information',
    icon: Type,
    color: 'from-purple-500 to-violet-600',
  },
];

export const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [inputMode, setInputMode] = useState<ConversionMode>('text');
  const [outputMode, setOutputMode] = useState<ConversionMode>('visual');
  const [instantMode, setInstantMode] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      inputMode,
      outputMode,
      instantMode,
    });
    onClose();
  };

  const ModeSelector = ({ 
    title, 
    selected, 
    onSelect 
  }: { 
    title: string; 
    selected: ConversionMode; 
    onSelect: (mode: ConversionMode) => void; 
  }) => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selected === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">{mode.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{mode.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Choose Conversion Mode
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <input
                type="checkbox"
                checked={instantMode}
                onChange={(e) => setInstantMode(e.target.checked)}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
              />
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-purple-600" />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Enable Instant Conversion Mode
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time conversion as you type or upload content
                  </p>
                </div>
              </div>
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <ModeSelector
              title="Input Mode"
              selected={inputMode}
              onSelect={setInputMode}
            />
            
            <div className="flex flex-col">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <ArrowRight size={24} className="text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <ModeSelector
                title="Output Mode"
                selected={outputMode}
                onSelect={setOutputMode}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={inputMode === outputMode}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Start Conversion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};