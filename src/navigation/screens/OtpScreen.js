/* eslint-disable no-unused-expressions */
import React from 'react';
import {
  SafeAreaView, TouchableOpacity, Text, StyleSheet, Keyboard, View, ActivityIndicator,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { Ionicons } from '@expo/vector-icons';

import FetchAPI from '../../api';
import { OtpInput } from '../../components/formComponents';
import color from '../../styles/color';

export default function OtpScreen({ route, navigation }) {
  const [inputs, setInputs] = React.useState({ otp: null });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [token] = React.useState(route.params?.data.token);

  const toast = useToast();

  React.useEffect(async () => {
    if (!token) {
      navigation.navigate('login', { status: 'fail', message: 'missing token try to login back' });
    } else if (route.params) {
      await handleReqotp(token);
    }
  }, []);

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.otp) {
      handleError('Please input otp', 'otp');
      isValid = false;
    }
    if (!inputs.otp && inputs.otp.toString().length !== 6) {
      handleError('Otp must be 6 digit', 'otp');
      isValid = false;
    }
    if (typeof (inputs.otp) !== 'number') {
      handleError('Otp must be a number', 'otp');
      isValid = false;
    }

    if (isValid) {
      handleSubmit();
    }
  };
  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: Number(text) }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleReqotp = async (tokens) => {
    setIsLoading(true);
    const res = await FetchAPI.reqOtp(tokens);
    setIsLoading(false);
    if (res.status === 'success') {
      toast.show(res.message, {
        type: 'customToast',
        data: {
          title: res.status,
          color: color.green,
        },
      });
    } else {
      toast.show('Fail to send verification code please try again later', {
        type: 'customToast',
        data: {
          title: 'fail',
          color: color.red,
        },
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await FetchAPI.verifyOtp(inputs.otp, token);
    setIsLoading(false);
    console.log(res);

    if (res.status === 'fail') {
      toast.show(res.message, {
        type: 'customToast',
        data: {
          title: 'fail',
          color: color.red,
        },
      });
    } else if (res.status === 'success') {
      toast.show(res.message, {
        type: 'customToast',
        data: {
          title: res.status,
          color: color.green,
        },
      });
      navigation.navigate('login');
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <Ionicons name="md-mail-open" size={70} style={{ marginBottom: 17 }} color="white" />
        <Text style={{
          color: color.white,
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 10,
        }}
        >
          Please Input Verification code
          {' '}

        </Text>
        <Text style={{
          color: color.white,
          fontSize: 12,
          textAlign: 'center',
        }}
        >
          Verification code has been sent via E-mail, please check your inbox or spam
        </Text>
      </View>
      <OtpInput
        onChangeText={(text) => handleOnchange(text, 'otp')}
        onFocus={() => handleError(null, 'otp')}
        error={errors.otp}
      />
      <Text
        style={{ color: color.white }}
        onPress={() => {
          handleReqotp();
        }}
      >
        Resend
      </Text>
      <TouchableOpacity
        onPress={() => validate()}
        activeOpacity={0.7}
        style={{
          height: 55,
          width: '70%',
          backgroundColor: color.blue,
          marginVertical: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: color.white, fontWeight: 'bold', fontSize: 18 }}>
          Verify Otp
        </Text>
      </TouchableOpacity>
      <View style={{
        position: 'absolute', top: '50%', right: 0, left: 0,
      }}
      >
        <ActivityIndicator animating={isLoading} size="large" color={color.darkBlue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: color.mainColor,
    flex: 1,
    alignItems: 'center',
  },
  container: {
    marginVertical: 40,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
