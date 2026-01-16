import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Brain, User, AlertCircle, Heart } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Check if this is a crisis resource message
  const isCrisisMessage = !isUser && (
    message.content.includes('IMMEDIATE HELP AVAILABLE') ||
    message.content.includes('National Suicide Prevention Lifeline') ||
    message.content.includes('Call 988') ||
    message.content.includes('Crisis Text Line')
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`
          flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
          ${isUser ? 'ml-2' : 'mr-2'}
          ${isUser ? 'bg-dark-purple-200 dark:bg-dark-purple-700' : isCrisisMessage ? 'bg-dark-purple-600 dark:bg-dark-purple-500' : 'bg-black dark:bg-dark-purple-800'}
        `}>
          {isUser ? (
            <User size={16} className="text-dark-purple-900 dark:text-dark-purple-100" />
          ) : isCrisisMessage ? (
            <AlertCircle size={16} className="text-white" />
          ) : (
            <Brain size={16} className="text-white" />
          )}
        </div>
        
        <div>
          <div className={`
            rounded-lg p-3 border-2
            ${isUser 
              ? 'bg-dark-purple-200 dark:bg-dark-purple-700 text-dark-purple-900 dark:text-dark-purple-100 border-transparent' 
              : isCrisisMessage
                ? 'bg-dark-purple-50 dark:bg-dark-purple-900 text-dark-purple-900 dark:text-dark-purple-100 border-dark-purple-300 dark:border-dark-purple-600 shadow-lg'
                : 'bg-black dark:bg-dark-purple-800 text-white border-transparent'
            }
          `}>
            {isCrisisMessage && (
              <div className="flex items-center mb-2 text-dark-purple-600 dark:text-dark-purple-400">
                <Heart size={16} className="mr-2" />
                <span className="font-semibold text-sm">Crisis Support Resources</span>
              </div>
            )}
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          
          <div className={`text-xs text-dark-purple-500 dark:text-dark-purple-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;