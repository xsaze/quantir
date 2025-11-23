'use client';

import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    onClick?: () => void;
    className?: string;
}

export function Button({
    children,
    variant = 'primary',
    href,
    onClick,
    className = ''
}: ButtonProps) {
    const baseClass = `${styles.button} ${styles[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={baseClass}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={baseClass}>
            {children}
        </button>
    );
}
