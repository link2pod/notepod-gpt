'use client'

import * as SUR from "@inrupt/solid-ui-react";
import { ReactNode } from "react";

export function SessionProvider({ children } : {children: ReactNode}) {
  return (
    <SUR.SessionProvider sessionId="app-session">
      {children}
    </SUR.SessionProvider>
  );
};
