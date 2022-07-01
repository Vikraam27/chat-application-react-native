import React from 'react';
import {
  Keyboard, ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';

import { CustomPicker, Input } from '../../components/formComponents';
import color from '../../styles/color';

import IconImg from '../../../assets/adaptive-icon.png';
import FetchAPI from '../../api';

export default function RegisterScreen({ navigation }) {
  const toast = useToast();
  const [inputs, setInputs] = React.useState({
    username: '',
    fullname: '',
    email: '',
    gender: '',
    status: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
    if (!inputs.username) {
      handleError('Please input username', 'username');
      isValid = false;
    }
    if (!inputs.fullname) {
      handleError('Please input fullname', 'fullname');
      isValid = false;
    }
    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (reg.test(inputs.email) === false) {
      handleError('Please input valid email', 'email');
      isValid = false;
    }
    if (!inputs.gender) {
      handleError('Please input gender', 'gender');
      isValid = false;
    }
    if (!inputs.status) {
      handleError('Please input status', 'status');
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
    const res = await FetchAPI.registerUser(inputs);
    setIsLoading(false);

    if (res.status === 'success') {
      toast.show(res.message, {
        type: 'customToast',
        data: {
          title: res.status,
          color: color.green,
        },
      });
      navigation.navigate('otp', res);
    } else if (res.status === 'fail') {
      toast.show(res.message, {
        type: 'customToast',
        data: {
          title: res.status,
          color: color.red,
        },
      });
    } else {
      toast.show('Something when wrong, Please try again later', {
        type: 'customToast',
        data: {
          title: 'fail',
          color: color.red,
        },
      });
    }
  };

  return (
    <ScrollView style={styles.main}>
      <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 70 }}>
          <Image source={IconImg} style={styles.imgIcon} />
        </View>
        <Text style={{ color: color.white, fontSize: 40, fontWeight: 'bold' }}>
          Create Account
        </Text>
        <Text style={{ color: color.gray, fontSize: 18, marginVertical: 10 }}>
          Please fill all field to create account
        </Text>
        <View>
          <Input
            onChangeText={(text) => handleOnchange(text, 'username')}
            onFocus={() => handleError(null, 'username')}
            iconName="person-circle-outline"
            label="Username"
            placeholder="Enter your username"
            error={errors.username}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, 'fullname')}
            onFocus={() => handleError(null, 'fullname')}
            iconName="person-circle-outline"
            label="Fullname"
            placeholder="Enter your fullname"
            error={errors.fullname}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="mail-open-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
          />
          <CustomPicker
            onFocus={() => handleError(null, 'email')}
            iconName="transgender-outline"
            error={errors.gender}
            label="Gender"
            onValueChange={(text) => handleOnchange(text, 'gender')}
            selectedValue={inputs.gender}
            pickerItem={['male', 'female', 'unknown']}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, 'status')}
            onFocus={() => handleError(null, 'status')}
            iconName="git-network-outline"
            label="Status"
            placeholder="Enter your status"
            error={errors.status}
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
              Register
            </Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', color: color.white, marginBottom: 20 }}>
            Already have account ?
            <Text onPress={() => navigation.navigate('login')} style={{ color: 'blue' }}>
              {' Login'}
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
  pickerStyle: {
    height: 55,
    backgroundColor: color.inputColor,
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 0.1,
    color: color.white,
  },
});
