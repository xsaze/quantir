'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import styles from './Pricing.module.css';

export function Pricing() {
    const scrollToWaitlist = () => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.section} id="pricing">
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2 className={styles.title}>Simple, Token-Gated Access</h2>
                    <p className={styles.subtitle}>
                        Free tier for everyone. Premium features for $QUANTIR holders.
                    </p>
                </motion.div>

                <div className={styles.tiers}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <GlassCard className={styles.tierCard}>
                            <h3 className={styles.tierTitle}>Free Tier</h3>
                            <div className={styles.tierPrice}>$0</div>
                            <p className={styles.tierDescription}>Perfect for getting started</p>

                            <ul className={styles.features}>
                                <li>✓ Basic market stats</li>
                                <li>✓ Limited data access</li>
                                <li>✓ View-only dashboard</li>
                                <li>✓ Community support</li>
                            </ul>

                            <Button variant="secondary" onClick={scrollToWaitlist} className={styles.tierButton}>
                                Try Free
                            </Button>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className={styles.featuredTier}
                    >
                        <GlassCard className={`${styles.tierCard} ${styles.premium}`}>
                            <div className={styles.badge}>Popular</div>
                            <h3 className={styles.tierTitle}>Token Holders</h3>
                            <div className={styles.tierPrice}>Hold $QUANTIR</div>
                            <p className={styles.tierDescription}>Unlock full power</p>

                            <ul className={styles.features}>
                                <li>✓ Everything in Free</li>
                                <li>✓ Custom AI prompting</li>
                                <li>✓ Full historical data</li>
                                <li>✓ Whale & insider alerts</li>
                                <li>✓ Priority data access</li>
                                <li>✓ Advanced analytics</li>
                            </ul>

                            <Button variant="primary" onClick={scrollToWaitlist} className={styles.tierButton}>
                                Get Access
                            </Button>
                        </GlassCard>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className={styles.disclaimer}
                >
                    <p>
                        ⚠️ <strong>Risk Warning:</strong> Not financial advice. Trading crypto involves significant risk.
                        Past performance doesn't guarantee future results.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
