import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CheckinScreen from "../screens/CheckinScreen";
import WellnessScreen from "../screens/WellnessScreen";
import FinanceScreen from "../screens/FinanceScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
        <Tab.Screen name="Check-in" component={CheckinScreen} options={{ title: "Check-in" }} />
        <Tab.Screen name="Bem-estar" component={WellnessScreen} options={{ title: "Bem-estar" }} />
        <Tab.Screen name="Finanças" component={FinanceScreen} options={{ title: "Finanças" }} />
        <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: "Perfil" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
