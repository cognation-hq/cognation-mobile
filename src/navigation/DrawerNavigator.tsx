import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { HoloTitle } from '../components/HoloTitle';
import { CommuneStackParamList, RootDrawerParamList } from './types';
import { CommuneStackNavigator } from './CommuneStackNavigator';
import { TowerScreen } from '../screens/TowerScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { CircleScreen } from '../screens/CircleScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const COMMUNE_TITLES: Record<keyof CommuneStackParamList, string> = {
  CommuneHome: 'Commune',
  Classroom: 'Classroom',
  Dating: 'Dating',
};

function communeFocusedName(
  route: Parameters<typeof getFocusedRouteNameFromRoute>[0],
): keyof CommuneStackParamList {
  const name = getFocusedRouteNameFromRoute(route) ?? 'CommuneHome';
  if (name === 'Classroom' || name === 'Dating' || name === 'CommuneHome') {
    return name;
  }
  return 'CommuneHome';
}

function CognationDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerScroll}
      style={styles.drawer}
    >
      <View style={styles.brand}>
        <View style={styles.brandGlow} pointerEvents="none" />
        <HoloTitle size={22}>Cognation</HoloTitle>
        <Text style={styles.brandTag}>calm · connected · intentional</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Tower"
      drawerContent={(props) => <CognationDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.headerBg,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.glowBorder,
          // Soft cyan under-glow on the header chrome
          shadowColor: colors.glow,
        },
        headerTintColor: colors.glow,
        headerTitleStyle: {
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: colors.text,
        },
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: colors.drawerBg,
          width: 288,
          borderRightWidth: 1,
          borderRightColor: colors.border,
        },
        drawerActiveBackgroundColor: colors.drawerActive,
        drawerActiveTintColor: colors.glow,
        drawerInactiveTintColor: colors.textMuted,
        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: 10,
          marginVertical: 2,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginLeft: -4,
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="Tower"
        component={TowerScreen}
        options={{ title: 'Tower', drawerLabel: 'Tower' }}
      />
      <Drawer.Screen
        name="Commune"
        component={CommuneStackNavigator}
        options={({ route, navigation }) => {
          const focused = communeFocusedName(route);
          const nested = focused !== 'CommuneHome';
          return {
            title: COMMUNE_TITLES[focused],
            drawerLabel: 'Commune',
            headerLeft: (props) =>
              nested ? (
                <HeaderBackButton
                  {...props}
                  tintColor={colors.glow}
                  onPress={() =>
                    navigation.navigate('Commune', { screen: 'CommuneHome' })
                  }
                />
              ) : (
                <DrawerToggleButton tintColor={colors.glow} />
              ),
          };
        }}
      />
      <Drawer.Screen
        name="News"
        component={NewsScreen}
        options={{ title: 'News', drawerLabel: 'News' }}
      />
      <Drawer.Screen
        name="Circle"
        component={CircleScreen}
        options={{ title: 'Circle', drawerLabel: 'Circle' }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', drawerLabel: 'Profile' }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: colors.drawerBg,
  },
  drawerScroll: {
    paddingTop: 16,
  },
  brand: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    marginBottom: 10,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  brandGlow: {
    position: 'absolute',
    top: -20,
    left: -10,
    width: 120,
    height: 80,
    borderRadius: 60,
    backgroundColor: colors.glowMuted,
  },
  brandTag: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 10,
    letterSpacing: 0.6,
    opacity: 0.85,
  },
});
