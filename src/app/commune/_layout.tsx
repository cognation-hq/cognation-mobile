import { Stack } from 'expo-router';
import { colors } from '../../theme/colors';

/**
 * Nested under the Commune drawer item.
 * Headers stay hidden — drawer chrome owns the top bar; ScreenShell titles stay in-content.
 */
export default function CommuneLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="classroom" />
      <Stack.Screen name="dating" />
    </Stack>
  );
}
