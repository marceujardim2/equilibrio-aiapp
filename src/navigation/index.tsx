import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CheckinScreen from "../screens/CheckinScreen";
import WellnessScreen from "../screens/WellnessScreen";
import FinanceScreen from "../screens/FinanceScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray400,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.gray100,
            paddingBottom: 8,
            paddingTop: 8,
            height: 65,
            elevation: 8,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
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
