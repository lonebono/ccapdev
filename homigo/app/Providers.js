//Enables Client Side Components
"use client";
// Import Necessary Modules/Components
import { SessionProvider } from "next-auth/react";
//Wraps the children components in a SessionProvider
export const AuthProvider = ({ children }) => {
  return <SessionProvider> {children} </SessionProvider>;
};