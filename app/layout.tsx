import type { ReactNode } from 'react';

import './globals.css';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Base Pulse Rewards</title>
        <meta name="description" content="A mobile-first Base mini app for quick wallet rewards and onchain community signals." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#fff3df" />
        <meta name="base:app_id" content="TODO_BASE_DEV_VERIFY_TOKEN" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
