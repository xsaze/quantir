import { Conversation } from '@/lib/mockChatApi';
import styles from './ConversationList.module.css';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
}

export default function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
}: ConversationListProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent selecting conversation when deleting
    if (confirm('Delete this conversation?')) {
      onDeleteConversation(id);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.newChatButton} onClick={onNewChat}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>New Chat</span>
      </button>

      <div className={styles.conversationList}>
        {conversations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No conversations yet</p>
            <p className={styles.emptyHint}>Start a new chat to begin</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`${styles.conversationItem} ${
                currentConversationId === conversation.id ? styles.active : ''
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className={styles.conversationContent}>
                <div className={styles.conversationHeader}>
                  <h3 className={styles.conversationTitle}>{conversation.title}</h3>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDelete(e, conversation.id)}
                    aria-label="Delete conversation"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                {conversation.preview && (
                  <p className={styles.conversationPreview}>{conversation.preview}</p>
                )}
                <span className={styles.conversationDate}>
                  {formatDate(conversation.updatedAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
