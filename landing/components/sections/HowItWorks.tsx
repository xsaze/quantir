'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import styles from './HowItWorks.module.css';

const steps = [
    {
        number: '01',
        title: 'Connect Wallet',
        description: 'Link your Solana wallet. No seed phrase required, fully secure.',
    },
    {
        number: '02',
        title: 'Hold $QNTR Token',
        description: 'Free tier available. Premium features unlocked by holding the token.',
    },
    {
        number: '03',
        title: 'Analyze & Trade',
        description: 'Chat with AI, explore dashboard insights, and gain your edge.',
    },
];

export function HowItWorks() {
    return (
        <section className={styles.section} id="how-it-works">
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2 className={styles.title}>How It Works</h2>
                    <p className={styles.subtitle}>Get started in three simple steps</p>
                </motion.div>

                <div className={styles.steps}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className={styles.stepWrapper}
                        >
                            <GlassCard className={styles.stepCard} hover={false}>
                                <div className={styles.stepNumber}>{step.number}</div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </GlassCard>
                            {index < steps.length - 1 && (
                                <div className={styles.arrow}>→</div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
