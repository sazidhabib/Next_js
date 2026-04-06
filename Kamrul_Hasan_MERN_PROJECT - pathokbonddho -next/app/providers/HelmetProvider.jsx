'use client';

import { HelmetProvider } from 'react-helmet-async';

export function CustomHelmetProvider({ children }) {
    return <HelmetProvider>{children}</HelmetProvider>;
}
