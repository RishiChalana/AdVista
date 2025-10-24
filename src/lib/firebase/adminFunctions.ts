'use client';

import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

// Helper to call the createImpersonationToken Cloud Function
export const createImpersonationToken = httpsCallable<{ targetUid: string }, { token?: string; error?: string }>(
  functions,
  'createImpersonationToken'
);
