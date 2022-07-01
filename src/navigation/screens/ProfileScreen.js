import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';

import { useToast } from 'react-native-toast-notifications';
import { Avatar } from 'react-native-elements';
import FetchAPI from '../../api';
import color from '../../styles/color';
import { List } from '../../components/formComponents';
import Token from '../../utils/AsyncStorage';
import UserInfoContex from '../../utils/Contex';

export default function ProfileScreen({ navigation }) {
  const [userinfo, setUserinfo] = React.useContext(UserInfoContex);
  const [userProfile, setUserProfile] = React.useState(null);
  const toast = useToast();

  const logOut = async () => {
    const response = await FetchAPI.logOut(userinfo.refreshToken);
    Token.Delete('refreshToken');
    Token.Delete('accessToken');
    setUserinfo((prev) => ({
      ...prev,
      refreshToken: null,
    }));
    toast.show('successfully loged out', {
      type: 'customToast',
      data: {
        title: response.status,
        color: color.green,
      },
    });
  };

  React.useEffect(async () => {
    const willFocus = navigation.addListener('focus', async () => {
      const accessToken = await Token.Get('accessToken');
      const response = await FetchAPI.getUserProfile(accessToken);
      setUserProfile(response.data);
    });

    return willFocus;
  }, []);
  if (!userProfile) {
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
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.profileImgContainer}>
          {userProfile.profileUrl ? (
            <View style={styles.imgBorder}>
              <Avatar
                size={110}
                rounded
                source={{ uri: userProfile.profileUrl }}
              />
            </View>
          ) : (
            <Avatar
              size={80}
              rounded
              title={userinfo.owner[0]}
              overlayContainerStyle={{ backgroundColor: '#3f3f3e' }}
              titleStyle={{ color: '#fff' }}
            />
          )}
          <View style={styles.profileBody}>
            <Text style={{
              color: color.white, fontSize: 18, fontWeight: 'bold', marginBottom: 10,
            }}
            >
              {userProfile.fullname}
            </Text>
            <Text style={{ color: color.white, fontSize: 15 }}>{userProfile.email}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <List
            name="Update profile"
            desc="update your information and profile picture"
            iconName="ios-person-outline"
            onPress={() => navigation.navigate('update-profile')}
          />
          <List
            name="Website"
            desc="open mychat in weh browser"
            iconName="globe-outline"
            onPress={() => console.log('[')}
          />
          <List
            name="Give us rate"
            desc="rate mychat in playstore"
            iconName="star-outline"
            onPress={() => console.log('[')}
          />
          <List
            name="Log-out"
            desc="log out from mychat"
            iconName="ios-log-out-outline"
            onPress={logOut}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: color.mainColor,
    flex: 1,
    margin: 0,
  },
  header: {
    marginTop: StatusBar.currentHeight,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    color: color.white,
  },
  container: {
    paddingHorizontal: 20,
  },
  body: {
    marginTop: 50,
  },
  profileImgContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  profileBody: {
    color: color.white,
    justifyContent: 'center',
    marginLeft: 50,
  },
  imgBorder: {
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemMenu: {
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: color.white,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
});
