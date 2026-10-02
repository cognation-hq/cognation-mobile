import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
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
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from '../auth/AuthContext';
import { HoloTitle } from '../components/HoloTitle';
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
  index: 'Commune',
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
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <ThemeProvider value={navTheme}>
          <StatusBar style="light" />
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
              name="index"
              options={{ title: 'Tower', drawerLabel: 'Tower' }}
            />
            <Drawer.Screen
              name="commune"
              options={({ route, navigation }) => {
                const name = getFocusedRouteNameFromRoute(route) ?? 'index';
                const nested = name === 'classroom' || name === 'dating';
                return {
                  title: COMMUNE_TITLES[name] ?? 'Commune',
                  drawerLabel: 'Commune',
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
              options={{ title: 'News', drawerLabel: 'News' }}
            />
            <Drawer.Screen
              name="circle"
              options={{ title: 'Circle', drawerLabel: 'Circle' }}
            />
            <Drawer.Screen
              name="profile"
              options={{ title: 'Profile', drawerLabel: 'Profile' }}
            />
          </Drawer>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
