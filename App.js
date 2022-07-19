/* eslint-disable global-require */
/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import * as Font from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ToastProvider } from 'react-native-toast-notifications';

import { ActivityIndicator, View } from 'react-native';
import TabbarContainer from './src/navigation/TabbarContainer';

// screen
import LoginScreen from './src/navigation/screens/LoginScreen';
import RegisterScreen from './src/navigation/screens/RegisterScreen';
import OtpScreen from './src/navigation/screens/OtpScreen';
import UpdateProfileScreen from './src/navigation/screens/UpdateProfileScreen';
import SearchUserScreen from './src/navigation/screens/SearchUserScreen';

// utils
import Token from './src/utils/AsyncStorage';
import UserInfoContex from './src/utils/Contex';
import FetchAPI from './src/api';
import color from './src/styles/color';
import CustomToast from './src/components/Toast';
import ChatScreen from './src/navigation/screens/ChatScreen';
import ImageScreen from './src/navigation/screens/ImageScreen';

const Stack = createStackNavigator();

function App() {
  const [isFontLoaded, setFontLoaded] = React.useState(false);
  const [userinfo, setUserinfo] = React.useState({
    refreshToken: null,
    owner: '',
    profileUrl: null,
  });
  async function loadFont() {
    await Font.loadAsync({
      'Comfortaa-Medium': require('./assets/fonts/Comfortaa-Medium.ttf'),
    });
    setFontLoaded(true);
  }

  React.useEffect(async () => {
    loadFont();
    const refToken = await Token.Get('refreshToken');
    setUserinfo((prev) => ({
      ...prev,
      refreshToken: refToken,
    }));
    if (refToken) {
      const accessToken = await Token.Get('accessToken');
      const response = await FetchAPI.getUserProfile(accessToken);
      setUserinfo((prev) => ({
        ...prev,
        profileUrl: response.data.profileUrl,
        owner: response.data.username,
      }));
    }
  }, []);
  if (!isFontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#112340" />
      </View>
    );
  }
  return (
    <UserInfoContex.Provider value={[userinfo, setUserinfo]}>
      <ToastProvider
        placement="top"
        animationType="slide-in"
        renderType={{
          customToast: (toast) => (
            <CustomToast toast={toast} />
          ),
        }}
      >
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { elevation: 0 },
              cardStyle: { backgroundColor: color.mainColor },
            }}
          >
            {userinfo.refreshToken === null ? (
              <>
                <Stack.Screen
                  name="login"
                  component={LoginScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="register"
                  component={RegisterScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="otp"
                  component={OtpScreen}
                  options={{
                    title: 'Verify E-mail',
                    headerTitleStyle: { color: color.white },
                    headerStyle: { backgroundColor: color.mainColor, borderBottomWidth: 0 },
                    headerTintColor: color.white,
                    headerTitleAlign: 'center',
                  }}
                />

              </>
            ) : (
              <>
                <Stack.Screen
                  name="home"
                  component={TabbarContainer}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="update-profile"
                  component={UpdateProfileScreen}
                  options={{
                    title: 'Update Profile',
                    headerTitleStyle: { color: color.white },
                    headerStyle: { backgroundColor: color.mainColor, borderBottomWidth: 0 },
                    headerTintColor: color.white,
                    headerTitleAlign: 'center',
                  }}
                />
                <Stack.Screen
                  name="search-user"
                  component={SearchUserScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="chat"
                  component={ChatScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="img"
                  component={ImageScreen}
                  options={{
                    headerTitle: 'back',
                    headerTitleStyle: { color: color.white },
                    headerStyle: { backgroundColor: color.mainColor, borderBottomWidth: 0 },
                    headerTintColor: color.white,
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </UserInfoContex.Provider>
  );
}

export default App;
