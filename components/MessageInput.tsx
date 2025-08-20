
import React, { useState } from 'react';
import { Theme } from '../types';
import SendIcon from './icons/SendIcon';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  theme: Theme;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, theme }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={`p-4 ${theme.primary} border-t border-white/10 transition-colors duration-500`}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={theme.placeholder}
          disabled={isLoading}
          className={`flex-1 w-full p-3 rounded-full ${theme.bg} ${theme.text} placeholder:text-gray-400 focus:outline-none focus:ring-2 ${theme.accent} transition-all duration-300 disabled:opacity-50`}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-12 h-12 flex items-center justify-center rounded-full ${theme.secondary} text-white transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
