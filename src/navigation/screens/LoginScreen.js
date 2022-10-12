import React from 'react';
import {
  Keyboard, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Image, ActivityIndicator, Platform,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as Updates from 'expo-updates';

import UserInfoContex from '../../utils/Contex';
import { Input } from '../../components/formComponents';
import color from '../../styles/color';
import Token from '../../utils/AsyncStorage';
import IconImg from '../../../assets/adaptive-icon.png';
import FetchAPI from '../../api';

export default function LoginScreen({ navigation, route }) {
  const [userinfo, setUserinfo] = React.useContext(UserInfoContex);
  const [inputs, setInputs] = React.useState({ email: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const toast = useToast();

  React.useEffect(async () => {
    if (route.params?.status) {
      toast.show(route.params.message, {
        type: 'customToast',
        data: {
          title: route.params.status,
          color: route.params.status === 'success' ? color.green : color.red,
        },
      });
    }
  }, [userinfo.refreshToken]);

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (reg.test(inputs.email) === false) {
      handleError('Please input valid email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    }
    if (isValid) {
      isValid = true;
      handleSubmit();
    }
  };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await FetchAPI.login(inputs);
    setIsLoading(false);

    if (res.status === 'fail') {
      toast.show(res.message, {
        type: 'customToast',
        data: {
          title: res.status,
          color: res.status === 'success' ? color.green : color.red,
        },
      });
    } else if (res.message === 'please verify your email address') {
      toast.show(res.message, {
        type: 'customToast',
        data: {
          title: res.status,
          color: color.green,
        },
      });
      navigation.navigate('otp', res);
    } else if (res.status === 'success') {
      await Token.Set('accessToken', res.data.accessToken);
      await Token.Set('refreshToken', res.data.refreshToken);

      setUserinfo((prev) => ({
        ...prev,
        refreshToken: res.data.refreshToken,
      }));
      if (Platform.OS === 'android') {
        setTimeout(async () => {
          await Updates.reloadAsync();
        }, 200);
      }
    }
  };

  return (
    <ScrollView style={styles.main}>
      <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 70 }}>
          <Image source={IconImg} style={styles.imgIcon} />
        </View>
        <Text style={{ color: color.white, fontSize: 40, fontWeight: 'bold' }}>
          Log In
        </Text>
        <Text style={{ color: color.gray, fontSize: 18, marginVertical: 10 }}>
          Please login to your account
        </Text>
        <View>
          <Input
            onChangeText={(text) => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="mail-open-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-closed-outline"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password
          />
          <TouchableOpacity
            onPress={() => validate()}
            activeOpacity={0.7}
            style={{
              height: 55,
              width: '100%',
              backgroundColor: color.blue,
              marginVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: color.white, fontWeight: 'bold', fontSize: 18 }}>
              Log in
            </Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', color: color.white }}>
            Don&apos;t have account ?
            <Text onPress={() => navigation.navigate('register')} style={{ color: 'blue', marginBottom: 20 }}>
              {' Sign up'}
            </Text>
          </Text>
          <View style={{
            position: 'absolute', top: '50%', right: 0, left: 0,
          }}
          >
            <ActivityIndicator animating={isLoading} size="large" color={color.darkBlue} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: color.mainColor,
    flex: 1,
  },
  imgIcon: {
    height: 150,
    width: 150,
  },
});
