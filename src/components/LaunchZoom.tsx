import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet } from 'react-native';

const LOGO = require('../../assets/splash-icon.png');

/**
 * X-style launch: the splash logo on the splash background (#000) scales up
 * fast and fades, revealing the app. Whole effect ≈ 550ms; never blocks the
 * app (it renders on top and removes itself). Reduce Motion → quick fade only.
 */
export function LaunchZoom() {
  const [done, setDone] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        const anim = reduce
          ? Animated.timing(fade, { toValue: 0, duration: 150, useNativeDriver: true })
          : Animated.sequence([
              Animated.delay(150),
              Animated.parallel([
                Animated.timing(scale, {
                  toValue: 14,
                  duration: 400,
                  easing: Easing.in(Easing.cubic),
                  useNativeDriver: true,
                }),
                Animated.timing(fade, {
                  toValue: 0,
                  duration: 400,
                  delay: 120,
                  easing: Easing.in(Easing.quad),
                  useNativeDriver: true,
                }),
              ]),
            ]);
        anim.start(() => setDone(true));
      });
    return () => {
      cancelled = true;
    };
  }, [fade, scale]);

  if (done) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.cover, { opacity: fade }]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cover: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  logo: { width: 200, height: 200 },
});
