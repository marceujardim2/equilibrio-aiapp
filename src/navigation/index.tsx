import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from "../screens/HomeScreen";
import CheckinScreen from "../screens/CheckinScreen";
import WellnessScreen from "../screens/WellnessScreen";
import FinanceScreen from "../screens/FinanceScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useTheme } from "../contexts/ThemeContext";
import { tokens } from "../hooks/tokens";
import { useThemedColors } from "../hooks/useThemedColors";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  const { theme } = useTheme();
  const colors = useThemedColors();
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';
  
  // Cores dinâmicas baseadas no tema
  const tabBarBackground = colors.surface1;
  const tabBarActiveColor = colors.primary;
  const tabBarInactiveColor = isDark ? colors.muted : colors.textSecondary;
  const borderColor = isDark ? colors.border : colors.divider;
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tabBarActiveColor,
          tabBarInactiveTintColor: tabBarInactiveColor,
          tabBarStyle: {
            backgroundColor: tabBarBackground,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            paddingBottom: 0,
            paddingTop: 8,
            height: 65 + Math.max(insets.bottom - 8, 0),
            elevation: 8,
            shadowColor: isDark ? '#000000' : colors.textPrimary,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: isDark ? 0.8 : 0.1,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Início",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Check-in"
          component={CheckinScreen}
          options={{
            title: "Check-in",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "checkbox" : "checkbox-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Bem-estar"
          component={WellnessScreen}
          options={{
            title: "Bem-estar",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "leaf" : "leaf-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Finanças"
          component={FinanceScreen}
          options={{
            title: "Finanças",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "wallet" : "wallet-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
