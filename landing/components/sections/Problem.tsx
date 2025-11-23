'use client';

import { motion } from 'framer-motion';
import styles from './Problem.module.css';

export function Problem() {
    return (
        <section className={styles.section} id="problem">
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.content}
                >
                    <div className={styles.problemSide}>
                        <h2 className={styles.title}>The Problem</h2>
                        <div className={styles.problemList}>
                            <div className={styles.problemItem}>
                                <span className={styles.icon}>❌</span>
                                <p>ChatGPT wrappers with no live data</p>
                            </div>
                            <div className={styles.problemItem}>
                                <span className={styles.icon}>❌</span>
                                <p>Too complex for beginners, too shallow for pros</p>
                            </div>
                            <div className={styles.problemItem}>
                                <span className={styles.icon}>❌</span>
                                <p>Focused on outdated historical analysis</p>
                            </div>
                            <div className={styles.problemItem}>
                                <span className={styles.icon}>❌</span>
                                <p>Missing Pump.fun & Solana-specific insights</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.solutionSide}>
                        <h2 className={styles.title}>The Quantir Difference</h2>
                        <div className={styles.solutionList}>
                            <div className={styles.solutionItem}>
                                <span className={styles.icon}>✓</span>
                                <div>
                                    <h4>Real AI Analysis</h4>
                                    <p>Powered by Claude Sonnet 4.5</p>
                                </div>
                            </div>
                            <div className={styles.solutionItem}>
                                <span className={styles.icon}>✓</span>
                                <div>
                                    <h4>Live On-Chain Data</h4>
                                    <p>Real-time Pump.fun & Solana insights</p>
                                </div>
                            </div>
                            <div className={styles.solutionItem}>
                                <span className={styles.icon}>✓</span>
                                <div>
                                    <h4>Beginner to Pro</h4>
                                    <p>Accessible insights + deep analytics</p>
                                </div>
                            </div>
                            <div className={styles.solutionItem}>
                                <span className={styles.icon}>✓</span>
                                <div>
                                    <h4>Free for Holders</h4>
                                    <p>Access premium features by holding $QUANTIR</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
