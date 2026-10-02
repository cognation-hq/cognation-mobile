import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';
import { body, eyebrow, panelTitle } from '../theme/typography';
import { useAuth } from './AuthContext';

type Mode = 'signIn' | 'signUp';

export function AuthPanel() {
  const { user, loading, configured, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <GlassCard>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.glow} />
          <Text style={styles.hint}>Checking session…</Text>
        </View>
      </GlassCard>
    );
  }

  if (!configured) {
    return (
      <GlassCard accent="violet">
        <Text style={styles.label}>Auth</Text>
        <Text style={styles.heading}>Env not set</Text>
        <Text style={styles.body}>
          Copy `.env.example` to `.env` with{' '}
          <Text style={styles.mono}>EXPO_PUBLIC_SUPABASE_URL</Text> and{' '}
          <Text style={styles.mono}>EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>, then
          restart Expo (`npx expo start`). Never commit real keys.
        </Text>
      </GlassCard>
    );
  }

  if (user) {
    return (
      <GlassCard>
        <Text style={styles.label}>Signed in</Text>
        <Text style={styles.heading}>Your account</Text>
        <Text style={styles.body}>{user.email ?? user.id}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonGhost,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            setBusy(true);
            setError(null);
            void signOut().then((result) => {
              setBusy(false);
              if (result.error) setError(result.error);
            });
          }}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color={colors.glow} />
          ) : (
            <Text style={styles.buttonGhostText}>Sign out</Text>
          )}
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </GlassCard>
    );
  }

  const onSubmit = () => {
    const trimmed = email.trim();
    if (!trimmed || password.length < 6) {
      setError('Enter email and a password (at least 6 characters).');
      setMessage(null);
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    const action = mode === 'signIn' ? signIn : signUp;
    void action(trimmed, password).then((result) => {
      setBusy(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.needsEmailConfirmation) {
        setMessage(
          'Check your email to confirm your account, then sign in.',
        );
        setMode('signIn');
        setPassword('');
      }
    });
  };

  return (
    <GlassCard>
      <Text style={styles.label}>Account</Text>
      <Text style={styles.heading}>
        {mode === 'signIn' ? 'Sign in' : 'Create account'}
      </Text>
      <Text style={styles.body}>
        Cognation wellness account — calm credentials, not a social feed.
      </Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={colors.textDim}
        value={email}
        onChangeText={setEmail}
        editable={!busy}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={colors.textDim}
        value={password}
        onChangeText={setPassword}
        editable={!busy}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.buttonPrimary,
          pressed && styles.pressed,
        ]}
        onPress={onSubmit}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color={colors.ink} />
        ) : (
          <Text style={styles.buttonPrimaryText}>
            {mode === 'signIn' ? 'Sign in' : 'Sign up'}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.switchRow}
        onPress={() => {
          setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'));
          setError(null);
          setMessage(null);
        }}
        disabled={busy}
      >
        <Text style={styles.switchText}>
          {mode === 'signIn'
            ? 'Need an account? Sign up'
            : 'Already have an account? Sign in'}
        </Text>
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  label: {
    ...eyebrow,
    marginBottom: 10,
  },
  heading: {
    ...panelTitle,
    marginBottom: 8,
  },
  body: {
    ...body,
    marginBottom: 16,
  },
  hint: {
    ...body,
    fontSize: 13,
  },
  mono: {
    color: colors.lavender,
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    color: colors.text,
    fontSize: 15,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: colors.glow,
    marginTop: 4,
  },
  buttonPrimaryText: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  buttonGhost: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.glowBorder,
    backgroundColor: colors.glowMuted,
  },
  buttonGhostText: {
    color: colors.glow,
    fontWeight: '600',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.85,
  },
  switchRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    color: colors.sky,
    fontSize: 14,
  },
  message: {
    marginTop: 12,
    color: colors.glow,
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    marginTop: 12,
    color: colors.orange,
    fontSize: 14,
    lineHeight: 20,
  },
});
