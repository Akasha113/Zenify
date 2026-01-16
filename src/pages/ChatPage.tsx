import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import storage from '../utils/storage';
import chatService from '../utils/chat';
import { ChatMessage as ChatMessageType, Conversation } from '../types';
import { MessageCircle, Clock, PlusCircle, Trash2 } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = React.useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Load conversations
  React.useEffect(() => {
    const loadedConversations = storage.getConversations();
    setConversations(loadedConversations);

    // Create a new conversation if none exists
    if (loadedConversations.length === 0) {
      const newConversation = storage.createConversation('New Conversation');
      const initializedConversation = chatService.initializeConversation(newConversation.id);
      
      if (initializedConversation) {
        setConversations([initializedConversation]);
        setActiveConversation(initializedConversation);
      } else {
        setConversations([newConversation]);
        setActiveConversation(newConversation);
      }
    } else {
      // Set the most recent conversation as active
      setActiveConversation(loadedConversations[loadedConversations.length - 1]);
    }
  }, []);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = async (message: string) => {
    if (!activeConversation) return;

    setIsLoading(true);

    try {
      const updatedConversation = await chatService.sendMessage(activeConversation.id, message);

      if (updatedConversation) {
        // Update the conversations list
        setConversations((prevConversations) =>
          prevConversations.map((convo) =>
            convo.id === updatedConversation.id ? updatedConversation : convo
          )
        );

        // Update the active conversation
        setActiveConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConversation = storage.createConversation('New Chat');
    
    // Initialize the conversation with the therapist's greeting
    const initializedConversation = chatService.initializeConversation(newConversation.id);
    
    if (initializedConversation) {
      setConversations([...conversations, initializedConversation]);
      setActiveConversation(initializedConversation);
    } else {
      // Fallback to empty conversation if initialization fails
      setConversations([...conversations, newConversation]);
      setActiveConversation(newConversation);
    }
  };

  const handleDeleteConversation = (conversationId: string, event: React.MouseEvent) => {
    // Prevent the conversation from being selected when clicking delete
    event.stopPropagation();
    
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.');
    
    if (!confirmed) return;
    
    const success = storage.deleteConversation(conversationId);
    
    if (success) {
      // Update the conversations list
      const updatedConversations = conversations.filter(convo => convo.id !== conversationId);
      setConversations(updatedConversations);
      
      // If we deleted the active conversation, select another one or clear selection
      if (activeConversation?.id === conversationId) {
        if (updatedConversations.length > 0) {
          // Select the most recent conversation
          setActiveConversation(updatedConversations[updatedConversations.length - 1]);
        } else {
          // No conversations left, create a new one
          const newConversation = storage.createConversation('New Conversation');
          const initializedConversation = chatService.initializeConversation(newConversation.id);
          
          if (initializedConversation) {
            setConversations([initializedConversation]);
            setActiveConversation(initializedConversation);
          } else {
            setConversations([newConversation]);
            setActiveConversation(newConversation);
          }
        }
      }
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleClearChat = () => {
    if (!activeConversation) return;

    // Clear messages in the active conversation
    const clearedConversation = { ...activeConversation, messages: [] };
    setActiveConversation(clearedConversation);

    // Update the conversations list
    setConversations((prevConversations) =>
      prevConversations.map((convo) =>
        convo.id === clearedConversation.id ? clearedConversation : convo
      )
    );

    // Persist the cleared conversation to storage
    storage.updateConversation(clearedConversation.id, { messages: [] });
  };

  // Filter out system messages for display
  const getDisplayMessages = (messages: ChatMessageType[]) => {
    return messages.filter((msg) => msg.role !== 'system');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-dark-purple-50 via-white to-dark-purple-100 dark:from-dark-purple-950 dark:via-dark-purple-900 dark:to-dark-purple-950 flex flex-col md:flex-row">
      {/* Conversations sidebar - hidden on mobile */}
      <div className="hidden md:block w-64 bg-white dark:bg-dark-purple-800 border-r border-dark-purple-200 dark:border-dark-purple-700 overflow-y-auto">
        <div className="p-4 border-b border-dark-purple-200 dark:border-dark-purple-700">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#6E2B8A' }}
          >
            <PlusCircle size={16} />
            New Chat
          </button>
        </div>

        <div className="overflow-y-auto">
          <AnimatePresence>
            {conversations.map((convo) => (
              <motion.div
                key={convo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className={`
                    w-full border-b border-dark-purple-100 dark:border-dark-purple-700 hover:bg-dark-purple-50 dark:hover:bg-dark-purple-700 transition-colors
                    ${activeConversation?.id === convo.id ? 'bg-dark-purple-100 dark:bg-dark-purple-700' : ''}
                  `}
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => handleSelectConversation(convo)}
                      className="flex-1 p-3 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-dark-purple-600 dark:text-dark-purple-400" />
                        <span className="truncate font-medium text-black dark:text-white">{convo.title}</span>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-xs text-dark-purple-600 dark:text-dark-purple-400">
                        <Clock size={12} />
                        <span>{new Date(convo.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={(e) => handleDeleteConversation(convo.id, e)}
                      className="p-2 m-1 rounded hover:bg-dark-purple-200 dark:hover:bg-dark-purple-700 text-dark-purple-600 dark:text-dark-purple-400 hover:text-dark-purple-700 dark:hover:text-dark-purple-300 transition-colors"
                      title="Delete conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile conversation selector */}
        <div className="md:hidden p-2 bg-white dark:bg-dark-purple-800 border-b border-dark-purple-200 dark:border-dark-purple-700">
          <div className="flex gap-2">
            <select
              value={activeConversation?.id}
              onChange={(e) => {
                const selectedConvo = conversations.find((c) => c.id === e.target.value);
                if (selectedConvo) handleSelectConversation(selectedConvo);
              }}
              className="flex-1 p-2 border border-dark-purple-200 dark:border-dark-purple-700 rounded bg-white dark:bg-dark-purple-700 text-black dark:text-white"
            >
              {conversations.map((convo) => (
                <option key={convo.id} value={convo.id}>
                  {convo.title}
                </option>
              ))}
            </select>
            
            {activeConversation && conversations.length > 1 && (
              <button
                onClick={(e) => handleDeleteConversation(activeConversation.id, e)}
                className="px-3 py-2 bg-dark-purple-200 dark:bg-dark-purple-700 text-dark-purple-600 dark:text-dark-purple-300 rounded hover:bg-dark-purple-300 dark:hover:bg-dark-purple-600 transition-colors"
                title="Delete current conversation"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <button
            onClick={handleNewConversation}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#6E2B8A' }}
          >
            <PlusCircle size={16} />
            New Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeConversation && (
            <div>
              {getDisplayMessages(activeConversation.messages).length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full py-20 text-center text-dark-purple-600 dark:text-dark-purple-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Brain size={48} className="mb-4 text-dark-purple-400 dark:text-dark-purple-600" />
                  <h2 className="text-xl font-semibold mb-2 text-dark-purple-900 dark:text-dark-purple-100">Welcome to MindFul Journal</h2>
                  <p className="max-w-md text-black dark:text-gray-200">
                    I'm your AI mental wellness companion. You can talk to me about your thoughts,
                    feelings, or anything that's on your mind.
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {getDisplayMessages(activeConversation.messages).map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-white dark:bg-dark-purple-800 border-t border-dark-purple-200 dark:border-dark-purple-700 flex items-center justify-between">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <button
            onClick={handleClearChat}
            className="ml-4 flex items-center gap-2 px-4 py-2 bg-dark-purple-600 dark:bg-dark-purple-500 text-white rounded-md hover:bg-dark-purple-700 dark:hover:bg-dark-purple-400 transition-colors"
          >
            <Trash2 size={16} />
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Brain icon import
import { Brain } from 'lucide-react';

export default ChatPage;