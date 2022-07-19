/* eslint-disable no-undef */
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-elements';
import { useToast } from 'react-native-toast-notifications';
import FetchAPI from '../../api';
import { CustomPicker, Input } from '../../components/formComponents';
import color from '../../styles/color';
import Token from '../../utils/AsyncStorage';
import UserInfoContex from '../../utils/Contex';

export default function UpdateProfileScreen({ navigation }) {
  const toast = useToast();
  const [userinfo, setUserinfo] = React.useContext(UserInfoContex);
  const [imgUri, setImgUri] = React.useState('');
  const [inputs, setInputs] = React.useState({
    username: '',
    fullname: '',
    email: '',
    gender: '',
    status: '',
    profileUrl: '',
  });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validate = async () => {
    setIsLoading(true);
    const accessToken = await Token.Get('accessToken');

    if (imgUri) {
      const formdata = new FormData();
      formdata.append('data', { uri: imgUri, name: 'image', type: 'image/jpeg' });

      const res = await FetchAPI.updateProfilePicture(formdata, accessToken);
      console.log(res);
      setUserinfo((prev) => ({
        ...prev,
        profileUrl: res.data.fileUri,
      }));
    }

    await FetchAPI.updateProfileInformation(inputs, accessToken);
    setIsLoading(false);
    navigation.navigate('Profile');
  };
  const uploadImageHandler = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.show('Sorry, we need camera roll permissions to make this work!', {
        type: 'customToast',
        data: {
          title: 'fail',
          color: color.red,
        },
      });
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      setImgUri(result.uri);
      setInputs((prev) => ({
        ...prev,
        profileUrl: result.uri,
      }));
    }
  };

  React.useEffect(async () => {
    const accessToken = await Token.Get('accessToken');
    const response = await FetchAPI.getUserProfile(accessToken);
    setInputs(response.data);
  }, []);
  if (!inputs) {
    return (
      <View style={{
        position: 'absolute', top: '50%', right: 0, left: 0,
      }}
      >
        <ActivityIndicator size="large" color={color.darkBlue} />
      </View>
    );
  }
  return (
    <ScrollView style={styles.main}>
      <View style={styles.profileImgContainer}>
        {inputs.profileUrl ? (
          <View style={styles.imgBorder}>
            <Avatar
              size={110}
              rounded
              source={{ uri: inputs.profileUrl }}
            />
          </View>
        ) : (
          <Avatar
            size={110}
            rounded
            title={userinfo.owner[0]}
            overlayContainerStyle={{ backgroundColor: '#3f3f3e' }}
            titleStyle={{ color: '#fff' }}
          />
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            height: 40,
            width: 160,
            backgroundColor: color.blue,
            marginVertical: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          onPress={uploadImageHandler}
        >
          <Text style={{ color: '#fff', fontSize: 13 }}>Change picture</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Input
          onFocus={() => handleError(null, 'username')}
          iconName="person-circle-outline"
          label="Username"
          placeholder="Enter your username"
          error={errors.username}
          editable={false}
          selectTextOnFocus={false}
          value={inputs.username}
        />
        <Input
          onChangeText={(text) => handleOnchange(text, 'fullname')}
          onFocus={() => handleError(null, 'fullname')}
          iconName="person-circle-outline"
          label="Fullname"
          placeholder="Enter your fullname"
          error={errors.fullname}
          value={inputs.fullname}
        />
        <Input
          onFocus={() => handleError(null, 'email')}
          iconName="mail-open-outline"
          label="Email"
          placeholder="Enter your email address"
          error={errors.email}
          editable={false}
          selectTextOnFocus={false}
          value={inputs.email}
        />
        <CustomPicker
          onFocus={() => handleError(null, 'email')}
          iconName="transgender-outline"
          error={errors.gender}
          label="Gender"
          onValueChange={(text) => handleOnchange(text, 'gender')}
          selectedValue={inputs.gender}
          pickerItem={['male', 'female', 'unknown']}
          value={inputs.gender}
        />
        <Input
          onChangeText={(text) => handleOnchange(text, 'status')}
          onFocus={() => handleError(null, 'status')}
          iconName="git-network-outline"
          label="Status"
          placeholder="Enter your status"
          error={errors.status}
          value={inputs.status}
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
            Update Profile
          </Text>
        </TouchableOpacity>
        <View style={{
          position: 'absolute', top: '50%', right: 0, left: 0,
        }}
        >
          <ActivityIndicator animating={isLoading} size="large" color={color.darkBlue} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: color.mainColor,
    flex: 1,
    paddingHorizontal: 10,
  },
  profileImgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    marginVertical: 40,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBorder: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
  },
});
