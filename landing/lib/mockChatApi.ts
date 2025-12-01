// Mock API for chat history management
// TODO: Replace with real API calls when backend is ready

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  preview?: string; // Last message preview
}

// In-memory storage (simulates backend database)
let conversations: Conversation[] = [];
let messages: Message[] = [];

// Helper to generate IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to generate conversation title from first message
const generateTitle = (firstMessage: string): string => {
  const maxLength = 50;
  return firstMessage.length > maxLength
    ? firstMessage.substring(0, maxLength) + '...'
    : firstMessage;
};

// Simulate API delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions

/**
 * Get all conversations
 */
export async function getConversations(): Promise<Conversation[]> {
  await delay();
  return [...conversations].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Get a single conversation by ID
 */
export async function getConversation(id: string): Promise<Conversation | null> {
  await delay();
  return conversations.find(c => c.id === id) || null;
}

/**
 * Create a new conversation
 */
export async function createConversation(firstMessage?: string): Promise<Conversation> {
  await delay();

  const conversation: Conversation = {
    id: generateId(),
    title: firstMessage ? generateTitle(firstMessage) : 'New Chat',
    createdAt: new Date(),
    updatedAt: new Date(),
    messageCount: 0,
    preview: firstMessage || undefined,
  };

  conversations.push(conversation);
  return conversation;
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  await delay();
  return messages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Send a message (user message)
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  role: 'user' | 'assistant' = 'user'
): Promise<Message> {
  await delay();

  const message: Message = {
    id: generateId(),
    conversationId,
    role,
    content,
    timestamp: new Date(),
  };

  messages.push(message);

  // Update conversation
  const conversation = conversations.find(c => c.id === conversationId);
  if (conversation) {
    conversation.updatedAt = new Date();
    conversation.messageCount += 1;
    conversation.preview = content;

    // Update title if this is the first user message
    if (conversation.messageCount === 1 && role === 'user') {
      conversation.title = generateTitle(content);
    }
  }

  return message;
}

/**
 * Get AI response (mock)
 */
export async function getAIResponse(conversationId: string, userMessage: string): Promise<Message> {
  await delay(500); // Simulate longer AI processing time

  // Mock AI responses
  const responses = [
    "I understand. Let me help you with that.",
    "That's an interesting question. Here's what I think...",
    "I can help you with that. Let me explain...",
    "Great question! Here's my perspective...",
    "I see what you're asking. The answer is...",
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  return await sendMessage(conversationId, randomResponse, 'assistant');
}

/**
 * Search conversations
 */
export async function searchConversations(query: string): Promise<Conversation[]> {
  await delay();

  if (!query.trim()) {
    return getConversations();
  }

  const lowerQuery = query.toLowerCase();

  // Search in conversation titles
  const matchingConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(lowerQuery) ||
    c.preview?.toLowerCase().includes(lowerQuery)
  );

  // Also search in messages
  const conversationIdsWithMatchingMessages = new Set(
    messages
      .filter(m => m.content.toLowerCase().includes(lowerQuery))
      .map(m => m.conversationId)
  );

  // Combine results
  const allMatching = new Set([
    ...matchingConversations.map(c => c.id),
    ...conversationIdsWithMatchingMessages
  ]);

  return conversations
    .filter(c => allMatching.has(c.id))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Delete a conversation
 */
export async function deleteConversation(id: string): Promise<void> {
  await delay();

  // Remove conversation
  conversations = conversations.filter(c => c.id !== id);

  // Remove associated messages
  messages = messages.filter(m => m.conversationId !== id);
}

/**
 * Clear all history
 */
export async function clearAllHistory(): Promise<void> {
  await delay();

  conversations = [];
  messages = [];
}

/**
 * Initialize with some mock data for testing
 */
export function initializeMockData() {
  // Only initialize if there's no data yet (prevents double initialization in React Strict Mode)
  if (conversations.length > 0) {
    return;
  }

  const now = new Date();

  // Create some sample conversations
  const conv1: Conversation = {
    id: 'mock-1',
    title: 'How to use React hooks?',
    createdAt: new Date(now.getTime() - 86400000 * 2), // 2 days ago
    updatedAt: new Date(now.getTime() - 86400000 * 2),
    messageCount: 4,
    preview: 'Thank you, that was helpful!',
  };

  const conv2: Conversation = {
    id: 'mock-2',
    title: 'Explain TypeScript generics',
    createdAt: new Date(now.getTime() - 86400000), // 1 day ago
    updatedAt: new Date(now.getTime() - 86400000),
    messageCount: 6,
    preview: 'Can you give me more examples?',
  };

  const conv3: Conversation = {
    id: 'mock-3',
    title: 'Best practices for Next.js',
    createdAt: new Date(now.getTime() - 3600000), // 1 hour ago
    updatedAt: new Date(now.getTime() - 3600000),
    messageCount: 2,
    preview: 'What about performance optimization?',
  };

  conversations = [conv1, conv2, conv3];

  // Add some mock messages
  messages = [
    {
      id: 'm1',
      conversationId: 'mock-1',
      role: 'user',
      content: 'How to use React hooks?',
      timestamp: new Date(now.getTime() - 86400000 * 2),
    },
    {
      id: 'm2',
      conversationId: 'mock-1',
      role: 'assistant',
      content: 'React hooks are functions that let you use state and other React features in functional components. The most common ones are useState and useEffect.',
      timestamp: new Date(now.getTime() - 86400000 * 2 + 1000),
    },
  ];
}
