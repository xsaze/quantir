'use client';

import { useEffect, useState } from 'react';
import { MaskMagicEffect } from './MaskMagicEffect';

export function ClientOnlyParticles() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <MaskMagicEffect
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}
        />
    );
}
