'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import styles from './Waitlist.module.css';

export function Waitlist() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Wait.dev integration
            // Replace with your actual wait.dev waitlist ID
            const response = await fetch('https://api.wait.dev/v1/waitlist/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    waitlist_id: 'YOUR_WAITLIST_ID', // Replace with your wait.dev waitlist ID
                    email: email,
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setEmail('');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to join waitlist. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.section} id="waitlist">
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard className={styles.card}>
                        {success ? (
                            <div className={styles.successMessage}>
                                <div className={styles.checkmark}>✓</div>
                                <h3>You're on the list!</h3>
                                <p>We'll notify you when Quantir launches.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className={styles.title}>Join the Waitlist</h2>
                                <p className={styles.subtitle}>
                                    Be the first to access Quantir when we launch. Get early-bird benefits and exclusive insights.
                                </p>

                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className={styles.input}
                                            disabled={loading}
                                        />
                                        <Button
                                            variant="primary"
                                            onClick={() => { }}
                                            className={styles.submitButton}
                                        >
                                            {loading ? 'Joining...' : 'Join Waitlist'}
                                        </Button>
                                    </div>

                                    {error && <p className={styles.error}>{error}</p>}
                                </form>

                                <p className={styles.privacy}>
                                    We respect your privacy. No spam, ever.
                                </p>
                            </>
                        )}
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
}
