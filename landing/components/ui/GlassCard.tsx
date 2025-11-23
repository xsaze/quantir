'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
    const [isInView, setIsInView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMobile || !cardRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const rect = entry.boundingClientRect;
                    const viewportHeight = window.innerHeight;
                    const centerStart = viewportHeight * 0.35;
                    const centerEnd = viewportHeight * 0.65;
                    const elementCenter = rect.top + rect.height / 2;

                    setIsInView(elementCenter >= centerStart && elementCenter <= centerEnd);
                } else {
                    setIsInView(false);
                }
            },
            { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
        );

        observer.observe(cardRef.current);

        return () => observer.disconnect();
    }, [isMobile]);

    const cardClass = `${styles.card} ${hover ? styles.hover : ''} ${isMobile && isInView ? styles.active : ''} ${className}`;

    return (
        <motion.div
            ref={cardRef}
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
