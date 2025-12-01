'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from './ChatInterface.module.css';
import MessageList from '../ui/MessageList';
import MessageInput from '../ui/MessageInput';
import ConversationList from '../ui/ConversationList';
import SearchBar from '../ui/SearchBar';
import {
  type Conversation,
  type Message,
  getConversations,
  getMessages,
  createConversation,
  sendMessage as apiSendMessage,
  getAIResponse,
  deleteConversation as apiDeleteConversation,
  searchConversations,
  initializeMockData,
  clearAllHistory as apiClearAllHistory,
} from '@/lib/mockChatApi';

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load messages for a conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    const msgs = await getMessages(conversationId);
    setMessages(msgs);
    setIsMobileMenuOpen(false); // Close mobile menu when selecting conversation
  }, []);

  // Initialize mock data and load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      // Initialize mock data (comment this out once you have real data)
      initializeMockData();

      const convs = await getConversations();
      setConversations(convs);
      setFilteredConversations(convs);

      // Auto-select the most recent conversation
      if (convs.length > 0) {
        loadConversation(convs[0].id);
      }
    };

    loadConversations();
  }, [loadConversation]);

  // Create a new conversation
  const handleNewChat = async () => {
    const newConv = await createConversation();
    const updatedConvs = await getConversations();
    setConversations(updatedConvs);
    setFilteredConversations(updatedConvs);
    setCurrentConversationId(newConv.id);
    setMessages([]);
    setIsMobileMenuOpen(false);
  };

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    let convId = currentConversationId;

    // If no conversation exists, create one
    if (!convId) {
      const newConv = await createConversation(content);
      convId = newConv.id;
      setCurrentConversationId(convId);
      const updatedConvs = await getConversations();
      setConversations(updatedConvs);
      setFilteredConversations(updatedConvs);
    }

    setIsLoading(true);

    try {
      // Send user message
      const userMsg = await apiSendMessage(convId, content, 'user');
      setMessages((prev) => [...prev, userMsg]);

      // Update conversation list
      const updatedConvs = await getConversations();
      setConversations(updatedConvs);
      setFilteredConversations(updatedConvs);

      // Get AI response (using mock for now)
      const aiMsg = await getAIResponse(convId, content);
      setMessages((prev) => [...prev, aiMsg]);

      // Update conversation list again
      const finalConvs = await getConversations();
      setConversations(finalConvs);
      setFilteredConversations(finalConvs);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  // Delete a conversation
  const handleDeleteConversation = async (id: string) => {
    await apiDeleteConversation(id);
    const updatedConvs = await getConversations();
    setConversations(updatedConvs);
    setFilteredConversations(updatedConvs);

    // If we deleted the current conversation, clear or switch
    if (id === currentConversationId) {
      if (updatedConvs.length > 0) {
        loadConversation(updatedConvs[0].id);
      } else {
        setCurrentConversationId(null);
        setMessages([]);
      }
    }
  };

  // Search conversations
  const handleSearch = async (query: string) => {
    const results = await searchConversations(query);
    setFilteredConversations(results);
  };

  // Clear all history
  const handleClearAllHistory = async () => {
    if (confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
      await apiClearAllHistory();
      setConversations([]);
      setFilteredConversations([]);
      setCurrentConversationId(null);
      setMessages([]);
    }
  };

  return (
    <div className={styles.container}>
      {/* Mobile Menu Toggle */}
      <button
        className={styles.mobileMenuToggle}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Side Menu with Chat History */}
      <aside className={`${styles.sideMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.menuContent}>
          <div className={styles.menuHeader}>
            <h1 className={styles.menuTitle}>Quantir Chat</h1>
            <button
              className={styles.clearAllButton}
              onClick={handleClearAllHistory}
              title="Clear all history"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>

          <SearchBar onSearch={handleSearch} />

          <ConversationList
            conversations={filteredConversations}
            currentConversationId={currentConversationId}
            onSelectConversation={loadConversation}
            onDeleteConversation={handleDeleteConversation}
            onNewChat={handleNewChat}
          />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={styles.mainArea}>
        <div className={styles.messageContainer}>
          <MessageList messages={messages} isLoading={isLoading} />
        </div>

        <div className={styles.inputArea}>
          <MessageInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}
