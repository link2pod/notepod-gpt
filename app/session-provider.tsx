'use client'

import { SessionProvider } from "@inrupt/solid-ui-react";
import { ReactNode } from "react";

export default function({ children } : {children: ReactNode}) {
  return (
    <SessionProvider sessionId="app-session">
      {children}
    </SessionProvider>
  );
};
