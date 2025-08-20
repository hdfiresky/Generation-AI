import React, { useEffect, useRef } from 'react';
import { Message as MessageType, Theme } from '../types';
import Message from './Message';

interface ChatWindowProps {
  messages: MessageType[];
  theme: Theme;
  isLoading: boolean;
}

const TypingIndicator: React.FC<{ theme: Theme }> = ({ theme }) => (
  <div className="flex items-end gap-2 animate-fadeIn">
    <div className="text-2xl mb-2">{theme.avatar}</div>
    <div className={`flex items-center space-x-1.5 ${theme.primary} ${theme.text} px-4 py-3 rounded-2xl rounded-bl-none transition-colors duration-500`}>
      <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
    </div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, theme, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-4 overflow-y-auto min-h-0">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} botAvatar={theme.avatar} theme={theme} />
        ))}
        {isLoading && <TypingIndicator theme={theme} />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;