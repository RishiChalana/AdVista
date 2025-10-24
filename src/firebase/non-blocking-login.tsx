'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(error => {
    // Although auth errors aren't FirestorePermissionError, we can log them
    // or handle them in a specific way if needed. For now, console.error is fine.
    console.error("Anonymous sign-in error:", error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  const promise = createUserWithEmailAndPassword(authInstance, email, password);
  promise.catch(error => {
    console.error("Email sign-up error:", error);
  });
  return promise;
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  const promise = signInWithEmailAndPassword(authInstance, email, password);
  promise.catch(error => {
    console.error("Email sign-in error:", error);
  });
  return promise;
}
