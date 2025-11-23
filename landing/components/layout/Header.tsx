'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import styles from './Header.module.css';

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Get header height to offset scroll position
            const headerHeight = 80; // Adjust if your header height changes
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setMobileMenuOpen(false);
        }
    };

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <span className={styles.logoText}>QUANTIR</span>
                </div>

                {/* Desktop Navigation */}
                <nav className={styles.nav}>
                    <button onClick={() => scrollToSection('features')} className={styles.navLink}>
                        Features
                    </button>
                    <button onClick={() => scrollToSection('how-it-works')} className={styles.navLink}>
                        How It Works
                    </button>
                    <button onClick={() => scrollToSection('pricing')} className={styles.navLink}>
                        Pricing
                    </button>
                </nav>

                <div className={styles.cta}>
                    <Button variant="primary" onClick={() => scrollToSection('waitlist')}>
                        Join Waitlist
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={mobileMenuOpen ? styles.hamburgerOpen : styles.hamburger}></span>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <button onClick={() => scrollToSection('features')} className={styles.mobileNavLink}>
                        Features
                    </button>
                    <button onClick={() => scrollToSection('how-it-works')} className={styles.mobileNavLink}>
                        How It Works
                    </button>
                    <button onClick={() => scrollToSection('pricing')} className={styles.mobileNavLink}>
                        Pricing
                    </button>
                    <Button variant="primary" onClick={() => scrollToSection('waitlist')}>
                        Join Waitlist
                    </Button>
                </div>
            )}
        </header>
    );
}
