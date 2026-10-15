import { ReactElement, ReactNode } from 'react';
import { RefreshControlProps, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { body, displayTitle } from '../theme/typography';
import { HeroStrip } from './HeroStrip';

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  refreshControl?: ReactElement<RefreshControlProps>;
  /** PULSE: web .circle-fall page background (indigo + cyan/violet halo). */
  halo?: boolean;
};

export function ScreenShell({ title, subtitle, children, refreshControl, halo }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.ambient} pointerEvents="none" />
      {halo ? <View style={styles.halo} pointerEvents="none" /> : null}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <HeroStrip />
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  ambient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    // Soft prismatic corner washes (static — no motion chrome)
    borderTopColor: 'transparent',
    shadowColor: colors.glow,
    shadowOpacity: 0.12,
    shadowRadius: 80,
    shadowOffset: { width: -40, height: -60 },
  },
  // Same layers as web css/styles.css .circle-fall (Alexa lock 2026-10-07).
  halo: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage:
      'radial-gradient(ellipse at 50% 44%, rgba(168, 244, 255, 0.16), transparent 42%), ' +
      'radial-gradient(ellipse at 52% 52%, rgba(197, 166, 255, 0.2), transparent 58%), ' +
      'linear-gradient(145deg, #171a3a 0%, #291b3a 100%)',
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 36,
    flexGrow: 1,
  },
  header: {
    marginBottom: 22,
    paddingTop: 6,
  },
  title: {
    ...displayTitle,
    color: colors.text,
    textShadowColor: 'rgba(61, 232, 255, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    ...body,
    marginTop: 12,
    maxWidth: 360,
  },
  body: {
    flex: 1,
    gap: 14,
  },
});
