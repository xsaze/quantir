'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import styles from './Hero.module.css';

export function Hero() {
    const scrollToWaitlist = () => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.hero} id="hero">
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.content}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className={styles.label}
                    >
                        AI-Powered Solana Analytics
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className={styles.headline}
                    >
                        Chaos Refined Into Equations.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className={styles.subheadline}
                    >
                        Real-time pattern recognition powered by AI. Analyze Pump.fun tokens,
                        track profitable wallets, and gain edge over the market.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className={styles.ctas}
                    >
                        <Button variant="primary" onClick={scrollToWaitlist}>
                            Join Waitlist
                        </Button>
                        <Button variant="secondary" onClick={scrollToFeatures}>
                            View Features →
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
