import React from 'react';
import { StyleSheet } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// screen
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewsScreen from './screens/NewsScreen';

import Colors from '../styles/color';

// Screen names
const homeName = 'Home';
const profileName = 'Profile';
const newsName = 'News';

const Tab = createBottomTabNavigator();

export default function TabbarContainer() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === newsName) {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (rn === profileName) {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
        showIcon: true,
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: [
          styles.tabBar,
          null,
        ],
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
      tab
    >

      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={newsName} component={NewsScreen} />
      <Tab.Screen name={profileName} component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    padding: 10,
    height: 60,
    backgroundColor: Colors.secondaryColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: Colors.secondaryColor,
    borderTopColor: Colors.secondaryColor,
  },
});
