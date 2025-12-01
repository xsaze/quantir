'use client';

import { Message } from '@/lib/mockChatApi';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`${styles.messageWrapper} ${isUser ? styles.userMessage : styles.assistantMessage
        }`}
    >
      {!isUser && (
        <div className={styles.authorLabel}>Quantir</div>
      )}
      <div className={styles.messageContent}>
        <div className={styles.messageBubble}>
          <p className={styles.messageText}>{message.content}</p>
        </div>
        <span className={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
