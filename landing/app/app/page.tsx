import ChatInterface from '@/components/sections/ChatInterface';
import styles from './page.module.css';

export default function AppPage() {
  return (
    <main className={styles.main}>
      <ChatInterface />
    </main>
  );
}
