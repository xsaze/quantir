'use client';

import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
    const cardClass = `${styles.card} ${hover ? styles.hover : ''} ${className}`;

    return (
        <motion.div
            className={cardClass}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
