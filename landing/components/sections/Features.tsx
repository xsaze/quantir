'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FeatureCard } from '../ui/FeatureCard';
import { WaveEffect } from '../effects/WaveEffect';
import styles from './Features.module.css';

// Simple icon components using Unicode characters and symbols
const features = [
    {
        icon: '🧠',
        title: 'AI Pattern Recognition',
        description: 'Find hidden patterns in market chaos with real-time AI analysis of trading behaviors and token movements.',
    },
    {
        icon: '💰',
        title: 'Profitable Wallet Tracking',
        description: 'Follow the smart money. Identify and monitor wallets with consistent wins and profitable strategies.',
    },
    {
        icon: '🐋',
        title: 'Insider & Whale Tracking',
        description: 'Spot the big players early. Track large holders and insider movements before breakouts happen.',
    },
    {
        icon: '📊',
        title: 'Sentiment Analysis',
        description: 'Read the room before it pumps. AI-powered social and on-chain sentiment scoring in real-time.',
    },
    {
        icon: '📈',
        title: 'Price Predictions',
        description: 'AI-powered forecasting using pattern-based probability analysis and historical data.',
    },
    {
        icon: '👨‍💻',
        title: 'Developer Reputation',
        description: 'Avoid rugs, find gems. Track developer history and credibility across projects.',
    },
    {
        icon: '⚡',
        title: 'Real-Time Signals',
        description: 'Never miss the move with instant market alerts and trading signals (coming soon).',
    },
    {
        icon: '💬',
        title: 'Custom AI Prompts',
        description: 'Your questions, AI answers. Query the database with natural language (premium feature).',
    },
];

export function Features() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
    const [backgroundSize, setBackgroundSize] = useState<number>(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Calculate background size dynamically based on section dimensions
    useEffect(() => {
        const calculateBackgroundSize = () => {
            if (sectionRef.current && isMobile) {
                const sectionHeight = sectionRef.current.offsetHeight;
                const viewportWidth = window.innerWidth;
                // Calculate diagonal to ensure full coverage when rotated
                const diagonal = Math.sqrt(Math.pow(viewportWidth, 2) + Math.pow(sectionHeight, 2));
                setBackgroundSize(diagonal);
            } else {
                setBackgroundSize(0);
            }
        };

        calculateBackgroundSize();
        window.addEventListener('resize', calculateBackgroundSize);

        return () => window.removeEventListener('resize', calculateBackgroundSize);
    }, [isMobile]);

    useEffect(() => {
        let lastY = window.scrollY;
        let rafId: number | null = null;
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            lastScrollY = window.scrollY;

            // Throttle with requestAnimationFrame
            if (rafId !== null) {
                return;
            }

            rafId = requestAnimationFrame(() => {
                rafId = null;
                const currentScrollY = lastScrollY;

                if (currentScrollY > lastY) {
                    setScrollDirection('down');
                } else if (currentScrollY < lastY) {
                    setScrollDirection('up');
                }
                lastY = currentScrollY;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
        };
    }, []);

    return (
        <section className={styles.section} id="features" ref={sectionRef}>
            <div
                className={styles.background}
                style={{
                    ...(isMobile && backgroundSize > 0 ? {
                        width: `${backgroundSize}px`,
                        height: `${backgroundSize}px`
                    } : {})
                }}
            >
                <WaveEffect
                    backgroundImage="/assets/6db8c45a-2b6b-4fed-9347-da402489f38f_3840w.jpg"
                    frequencyX={46}
                    frequencyY={50}
                    amplitude={0.1}
                    speed={0.4}
                />
                {/* Shadow overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        boxShadow: 'inset 0 20px 60px rgba(0, 0, 0, 1)',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}
                />
            </div>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2 className={styles.title}>Intelligent • Innovative • Insightful</h2>
                    <p className={styles.subtitle}>
                        Real AI analysis for Pump.fun tokens and Solana on-chain data
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onViewportEnter={() => {
                                if (isMobile) {
                                    if (scrollDirection === 'down') {
                                        if (index > 0) {
                                            setActiveIndex(index - 1);
                                            // If this is the last element, highlight it after a short delay
                                            if (index === features.length - 1) {
                                                setTimeout(() => setActiveIndex(index), 400);
                                            }
                                        }
                                    } else if (scrollDirection === 'up') {
                                        if (index < features.length - 1) {
                                            setActiveIndex(index + 1);
                                            // If this is the first element, highlight it after a short delay
                                            if (index === 0) {
                                                setTimeout(() => setActiveIndex(index), 400);
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                active={isMobile && activeIndex === index}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
