import { StyleSheet, Text, View } from 'react-native';
import { AuthPanel } from '../auth/AuthPanel';
import { useAuth } from '../auth/AuthContext';
import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';
import { body } from '../theme/typography';

export function ProfileScreen() {
  const { user, loading, configured } = useAuth();

  const subtitle = user
    ? 'Signed in — presence and privacy stay here.'
    : 'Sign in to Cognation, or browse the calm shell unsigned.';

  return (
    <ScreenShell title="Profile" subtitle={subtitle}>
      <AuthPanel />

      {!loading && configured && !user ? (
        <View style={styles.softGate}>
          <Text style={styles.softGateText}>
            Tower data and full Profile wire-up come later. You can keep exploring
            drawer screens while unsigned.
          </Text>
        </View>
      ) : null}

      <ComingSoonBlock heading="Presence & privacy" accent="violet">
        Avatar, presence, and privacy controls land in a later slice — this
        screen is auth-first only.
      </ComingSoonBlock>
      <MockPanel
        title="Settings strip"
        hint="Empty glass — controls later"
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
});
