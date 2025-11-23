'use client';

import { GlassCard } from './GlassCard';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    active?: boolean;
}

export function FeatureCard({ icon, title, description, active = false }: FeatureCardProps) {
    const cardClass = `${styles.featureCard} ${active ? styles.active : ''}`;

    return (
        <GlassCard className={cardClass} active={active}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </GlassCard>
    );
}
