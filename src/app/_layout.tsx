import 'react-native-gesture-handler';
import type React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Oswald_600SemiBold, Oswald_700Bold, useFonts } from '@expo-google-fonts/oswald';
import { fonts } from '../theme/typography';
import { DarkTheme, ThemeProvider } from 'expo-router';
import {
  Drawer,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerToggleButton,
  type DrawerContentComponentProps,
} from 'expo-router/drawer';
import {
  HeaderBackButton,
  getFocusedRouteNameFromRoute,
} from 'expo-router/react-navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from '../auth/AuthContext';
import { ProfileScreen } from '../screens/ProfileScreen';
import { HoloTitle } from '../components/HoloTitle';
import { LaunchZoom } from '../components/LaunchZoom';
import { colors } from '../theme/colors';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surfaceSolid,
    text: colors.text,
    border: colors.border,
    primary: colors.glow,
    notification: colors.accent,
  },
};

const COMMUNE_TITLES: Record<string, string> = {
  index: 'ECHO',
  classroom: 'Classroom',
  dating: 'Dating',
};

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
      <SignOutItem />
    </DrawerContentScrollView>
  );
}

function SignOutItem() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <Pressable
      style={styles.signOut}
      accessibilityRole="button"
      onPress={() => {
        void signOut();
      }}
    >
      <Text style={styles.signOutText}>Sign out</Text>
    </Pressable>
  );
}

/** Signed out → sign-in screen. Signed in → app, Profile hidden from the menu. */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth();
  if (configured && loading) return <View style={styles.root} />;
  if (configured && !user) return <ProfileScreen />;
  return <>{children}</>;
}

export default function RootLayout() {
  // Non-blocking: never wait on fonts; system font is used if loading fails.
  useFonts({ Oswald_600SemiBold, Oswald_700Bold });
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <ThemeProvider value={navTheme}>
          <StatusBar style="light" />
          <AuthGate>
          <Drawer
            initialRouteName="index"
            drawerContent={(props) => <CognationDrawerContent {...props} />}
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.headerBg,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: colors.glowBorder,
                shadowColor: colors.glow,
              },
              headerTintColor: colors.glow,
              headerTitleStyle: {
                fontFamily: fonts.displaySemi,
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
              name="index"
              options={{ title: 'TOWER', drawerLabel: 'TOWER' }}
            />
            <Drawer.Screen
              name="commune"
              options={({ route, navigation }) => {
                const name = getFocusedRouteNameFromRoute(route) ?? 'index';
                const nested = name === 'classroom' || name === 'dating';
                return {
                  title: COMMUNE_TITLES[name] ?? 'ECHO',
                  drawerLabel: 'ECHO',
                  headerLeft: (props) =>
                    nested ? (
                      <HeaderBackButton
                        {...props}
                        tintColor={colors.glow}
                        onPress={() =>
                          navigation.navigate('commune', { screen: 'index' })
                        }
                      />
                    ) : (
                      <DrawerToggleButton tintColor={colors.glow} />
                    ),
                };
              }}
            />
            <Drawer.Screen
              name="news"
              options={{ title: 'SIGNAL', drawerLabel: 'SIGNAL' }}
            />
            <Drawer.Screen
              name="circle"
              options={{ title: 'PULSE', drawerLabel: 'PULSE' }}
            />
            <Drawer.Screen
              name="profile"
              options={{
                title: 'Profile',
                drawerLabel: 'Profile',
                drawerItemStyle: { display: 'none' },
              }}
            />
          </Drawer>
          </AuthGate>
        </ThemeProvider>
        <LaunchZoom />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  signOut: {
    minHeight: 44,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
  },
  signOutText: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
