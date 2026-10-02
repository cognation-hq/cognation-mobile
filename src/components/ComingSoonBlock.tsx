import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { body, eyebrow, panelTitle } from '../theme/typography';
import { GlassCard } from './GlassCard';

type Props = {
  label?: string;
  heading?: string;
  children: string | ReactNode;
  accent?: 'cyan' | 'magenta' | 'violet';
  footer?: string;
};

export function ComingSoonBlock({
  label = 'Coming soon',
  heading,
  children,
  accent = 'cyan',
  footer,
}: Props) {
  return (
    <GlassCard accent={accent}>
      <View style={styles.row}>
        <View style={[styles.dot, accent === 'magenta' && styles.dotMagenta, accent === 'violet' && styles.dotViolet]} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
      {typeof children === 'string' ? (
        <Text style={styles.body}>{children}</Text>
      ) : (
        children
      )}
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.glow,
    shadowColor: colors.glow,
    shadowOpacity: 0.85,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  dotMagenta: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
  },
  dotViolet: {
    backgroundColor: colors.violet,
    shadowColor: colors.violet,
  },
  label: {
    ...eyebrow,
  },
  heading: {
    ...panelTitle,
    marginBottom: 8,
  },
  body: {
    ...body,
  },
  footer: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textDim,
  },
});
