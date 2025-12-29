
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] flex items-start gap-2 md:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-emerald-600' : 'bg-slate-200'
        }`}>
          <i className={`fa-solid ${isUser ? 'fa-user' : 'fa-hat-wizard'} text-[10px] text-white`}></i>
        </div>
        
        <div className={`p-3 md:p-4 rounded-2xl shadow-sm ${
          isUser 
          ? 'bg-emerald-600 text-white rounded-tr-none' 
          : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>
          <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
