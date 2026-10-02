import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { CommuneStackParamList } from './types';
import { CommuneScreen } from '../screens/CommuneScreen';
import { ClassroomScreen } from '../screens/ClassroomScreen';
import { DatingScreen } from '../screens/DatingScreen';

const Stack = createNativeStackNavigator<CommuneStackParamList>();

/**
 * Nested under the Commune drawer item.
 * Headers stay hidden — drawer chrome owns the top bar; ScreenShell titles stay in-content.
 */
export function CommuneStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CommuneHome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="CommuneHome" component={CommuneScreen} />
      <Stack.Screen name="Classroom" component={ClassroomScreen} />
      <Stack.Screen name="Dating" component={DatingScreen} />
    </Stack.Navigator>
  );
}
