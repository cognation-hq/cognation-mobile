import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  AUTH_TIMEOUT_MS,
  formatAuthError,
  withAuthTimeout,
} from './authTimeout';
import { PASSWORD_RESET_REDIRECT_URL } from './passwordReset';

type AuthResult = {
  error: string | null;
  /** True when sign-up succeeded but email confirmation is pending (no session yet). */
  needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  /** Always resolves with error: null so the UI never reveals whether the email exists. */
  requestPasswordReset: (email: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthError(err: unknown): string {
  if (err instanceof Error) {
    return formatAuthError(err.message) ?? err.message;
  }
  return formatAuthError(String(err)) ?? 'Something went wrong. Try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    void withAuthTimeout(supabase.auth.getSession(), AUTH_TIMEOUT_MS)
      .then(({ data }) => {
        if (mounted) {
          setSession(data.session);
          setLoading(false);
        }
      })
      .catch(() => {
        // Session check timed out or failed — show sign-in rather than spin forever.
        if (mounted) {
          setSession(null);
          setLoading(false);
        }
      });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, next) => {
        if (mounted) {
          setSession(next);
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase is not configured. Add env vars and restart Expo.',
      };
    }
    try {
      const { error } = await withAuthTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        AUTH_TIMEOUT_MS,
      );
      return { error: formatAuthError(error?.message ?? null) };
    } catch (err) {
      return { error: toAuthError(err) };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase is not configured. Add env vars and restart Expo.',
      };
    }
    try {
      const { data, error } = await withAuthTimeout(
        supabase.auth.signUp({ email, password }),
        AUTH_TIMEOUT_MS,
      );
      if (error) {
        return { error: formatAuthError(error.message) };
      }
      if (data.user && !data.session) {
        return { error: null, needsEmailConfirmation: true };
      }
      return { error: null };
    } catch (err) {
      return { error: toAuthError(err) };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    try {
      const { error } = await withAuthTimeout(
        supabase.auth.signOut(),
        AUTH_TIMEOUT_MS,
      );
      return { error: formatAuthError(error?.message ?? null) };
    } catch (err) {
      return { error: toAuthError(err) };
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase is not configured. Add env vars and restart Expo.',
      };
    }
    // Match the website: always treat the request as sent. Swallow network /
    // API errors so the UI never reveals whether the address has an account.
    try {
      await withAuthTimeout(
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: PASSWORD_RESET_REDIRECT_URL,
        }),
        AUTH_TIMEOUT_MS,
      );
    } catch {
      // ignore — neutral confirmation is shown by the panel
    }
    return { error: null };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
    }),
    [session, loading, signIn, signUp, signOut, requestPasswordReset],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
