'use client';

import { GlassCard } from './GlassCard';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <GlassCard className={styles.featureCard}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </GlassCard>
    );
}
