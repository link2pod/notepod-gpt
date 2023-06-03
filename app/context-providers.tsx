'use client'

import {SessionProvider as SP} from "@inrupt/solid-ui-react";
import { ReactNode } from "react";

export function SessionProvider({ children } : {children: ReactNode}) {
  return (
    <SP sessionId="app-session">
      {children}
    </SP>
  );
};
