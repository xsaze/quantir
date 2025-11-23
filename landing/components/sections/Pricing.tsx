'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { WaveEffect } from '../effects/WaveEffect';
import styles from './Pricing.module.css';

export function Pricing() {
    const scrollToWaitlist = () => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.section} id="pricing">
            <div className={styles.waveBackground}>
                <WaveEffect
                    backgroundImage="/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg"
                    frequencyX={45}
                    frequencyY={45}
                    amplitude={0.067}
                    speed={0.2}
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
                    <h2 className={styles.title}>Explore our plans</h2>
                    <p className={styles.subtitle}>
                        Choose your plan: Free tier, Pro subscription, or premium access for $QNTR holders.
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
                                <li>✓ Free for limited time</li>
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
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <GlassCard className={`${styles.tierCard} ${styles.proTier}`}>
                            <h3 className={styles.tierTitle}>Pro Tier</h3>
                            <div className={styles.tierPrice}>$200<span className={styles.period}>/mo</span></div>
                            <p className={styles.tierDescription}>Professional trading tools</p>

                            <ul className={styles.features}>
                                <li>✓ Advanced profitable wallet tracking</li>
                                <li>✓ Full historical data</li>
                                <li>✓ Whale & insider alerts</li>
                                <li>✓ Advanced analytics</li>

                            </ul>

                            <Button variant="primary" onClick={scrollToWaitlist} className={styles.tierButton}>
                                Get Pro
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
                            <h3 className={styles.tierTitle}>Token Holders</h3>
                            <div className={styles.tierPrice}>1M $QNTR</div>
                            <p className={styles.tierDescription}>Hold to unlock</p>

                            <ul className={styles.features}>
                                <li>✓ Everything in Pro Tier</li>
                                <li>✓ Access to private features</li>
                                <li>✓ Share of project's revenue</li>
                                <li>✓ Custom AI prompting (Coming soon)</li>
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
                        <strong>Risk Warning:</strong> Not financial advice. Trading crypto involves significant risk.
                        Past performance doesn't guarantee future results.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
