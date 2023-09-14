//app/components/Providers.tsx

'use client';

import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';

function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default Providers;
