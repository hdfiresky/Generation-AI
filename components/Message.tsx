
import React from 'react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
  botAvatar: string;
  theme: { primary: string, secondary: string, text: string };
}

const Message: React.FC<MessageProps> = ({ message, botAvatar, theme }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex items-end gap-2 animate-fadeIn ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && <div className="text-2xl mb-2">{botAvatar}</div>}
      <div
        className={`max-w-md lg:max-w-xl px-4 py-3 rounded-2xl transition-colors duration-500 ${
          isBot
            ? `${theme.primary} ${theme.text} rounded-bl-none`
            : `${theme.secondary} text-white rounded-br-none`
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
