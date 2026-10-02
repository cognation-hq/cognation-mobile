import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AuthPanel } from '../auth/AuthPanel';
import { useAuth } from '../auth/AuthContext';
import { DemoBadge } from '../components/DemoBadge';
import { GlassCard } from '../components/GlassCard';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';
import { fetchMyProfiles } from '../lib/cognation-data';
import type { CognationProfile } from '../lib/types';
import { colors } from '../theme/colors';
import { body, eyebrow, panelTitle } from '../theme/typography';

export function ProfileScreen() {
  const { user, loading, configured } = useAuth();
  const [profiles, setProfiles] = useState<CognationProfile[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    if (!user?.id || !configured) {
      setProfiles([]);
      setProfileError(null);
      return;
    }
    setProfileLoading(true);
    setProfileError(null);
    const result = await fetchMyProfiles(user.id);
    setProfileLoading(false);
    if (!result.ok) {
      setProfiles([]);
      setProfileError(result.error);
      return;
    }
    setProfiles(result.data);
  }, [user?.id, configured]);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const personal =
    profiles.find((p) => p.kind === 'personal') ?? profiles[0] ?? null;
  const professional =
    profiles.find((p) => p.kind === 'professional') ?? null;

  const subtitle = user
    ? 'Signed in — live profile from Cognation Supabase.'
    : 'Sign in to Cognation, or browse the calm shell unsigned.';

  return (
    <ScreenShell title="Profile" subtitle={subtitle}>
      <AuthPanel />

      {!loading && configured && !user ? (
        <View style={styles.softGate}>
          <Text style={styles.softGateText}>
            Sign in to load your Tower profile (name, handle, Demo badge).
            Other drawer screens stay browsable unsigned.
          </Text>
        </View>
      ) : null}

      {user && configured ? (
        <GlassCard accent="violet">
          <Text style={styles.label}>Your profile</Text>
          {profileLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.glow} />
              <Text style={styles.hint}>Loading profile…</Text>
            </View>
          ) : profileError ? (
            <View style={styles.errorBlock}>
              <Text style={styles.error}>{profileError}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.retry,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  void loadProfiles();
                }}
              >
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : personal ? (
            <View style={styles.profileBlock}>
              <View style={styles.nameRow}>
                <Text style={styles.heading}>{personal.display_name}</Text>
                <DemoBadge accountKind={personal.account_kind} />
              </View>
              <Text style={styles.handle}>@{personal.handle}</Text>
              <Text style={styles.meta}>
                {personal.kind === 'professional' ? 'Professional' : 'Personal'}
                {' · '}
                {user.email ?? user.id}
              </Text>
              {personal.bio ? (
                <Text style={styles.bio}>{personal.bio}</Text>
              ) : (
                <Text style={styles.bioEmpty}>No bio yet.</Text>
              )}
              {professional ? (
                <Text style={styles.secondary}>
                  Also: {professional.display_name} @{professional.handle}{' '}
                  (professional)
                </Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.body}>
              No profile row yet for this account. A personal Tower profile is
              normally created on signup — try refresh, or check the website.
            </Text>
          )}
        </GlassCard>
      ) : null}

      <MockPanel
        title="Settings strip"
        hint="Empty glass — privacy controls later"
        accent="cyan"
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  softGate: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  softGateText: {
    ...body,
    color: colors.textDim,
    fontSize: 13,
    lineHeight: 20,
  },
  label: {
    ...eyebrow,
    marginBottom: 10,
  },
  heading: {
    ...panelTitle,
    flexShrink: 1,
  },
  nameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  handle: {
    color: colors.sky,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  meta: {
    ...body,
    fontSize: 13,
    marginBottom: 10,
  },
  bio: {
    ...body,
    color: colors.text,
  },
  bioEmpty: {
    ...body,
    color: colors.textDim,
    fontStyle: 'italic',
  },
  secondary: {
    ...body,
    marginTop: 12,
    fontSize: 13,
    color: colors.lavender,
  },
  body: {
    ...body,
  },
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  hint: {
    ...body,
    fontSize: 13,
  },
  profileBlock: {
    gap: 0,
  },
  errorBlock: {
    gap: 12,
  },
  error: {
    color: colors.orange,
    fontSize: 14,
    lineHeight: 20,
  },
  retry: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.glowBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.glowMuted,
  },
  retryText: {
    color: colors.glow,
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.85,
  },
});
