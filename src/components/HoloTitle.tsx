import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { holoWordmarkStyle } from '../theme/typography';

type Props = {
  children: string;
  size?: number;
};

/**
 * Gradient wordmark on web; layered cyan/magenta glow on native.
 */
export function HoloTitle({ children, size = 24 }: Props) {
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.stack}>
        <Text
          style={[
            holoWordmarkStyle(size),
            styles.glowLayerMagenta,
            { fontSize: size },
          ]}
          accessible={false}
        >
          {children}
        </Text>
        <Text style={[holoWordmarkStyle(size), styles.glowLayerCyan, { fontSize: size }]}>
          {children}
        </Text>
      </View>
    );
  }

  return <Text style={holoWordmarkStyle(size)}>{children}</Text>;
}

const styles = StyleSheet.create({
  stack: {
    position: 'relative',
  },
  glowLayerMagenta: {
    position: 'absolute',
    left: 1,
    top: 1,
    color: colors.accent,
    opacity: 0.45,
    textShadowColor: 'rgba(255, 77, 219, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  glowLayerCyan: {
    color: colors.glow,
    textShadowColor: 'rgba(61, 232, 255, 0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
});
