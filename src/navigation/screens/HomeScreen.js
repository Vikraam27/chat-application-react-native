import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TextInput, TouchableOpacity, Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import color from '../../styles/color';
import newIcons from '../../icons/new-message.png';
import FetchAPI from '../../api';
import Token from '../../utils/AsyncStorage';
import { MessageCard } from '../../components/Card';

function HomeScreen({ navigation }) {
  const [rooms, setRooms] = useState(null);
  let refreshing = false;
  useEffect(async () => {
    await getAllRooms();
  }, []);

  const getAllRooms = async () => {
    const accessToken = await Token.Get('accessToken');
    const res = await FetchAPI.getAllRooms(accessToken);
    setRooms(res.data);
  };

  const onRefresh = React.useCallback(async () => {
    refreshing = true;
    await getAllRooms();
    refreshing = false;
  }, []);

  const navigateRoom = (roomId) => {
    navigation.navigate('chat', { roomid: roomId });
  };
  if (!rooms) {
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
    <>
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
      )}
        style={styles.main}
      >
        <View style={styles.headers}>
          <Text style={{
            color: color.white, fontSize: 40, fontWeight: '700', fontFamily: 'Comfortaa-Medium',
          }}
          >
            Messages
          </Text>
        </View>
        <View style={styles.TextInputContainer}>
          <Ionicons name="md-search-outline" size={24} color="white" />
          <TextInput placeholderTextColor={color.white} placeholder="Search" style={styles.TextInput} />
        </View>
        {rooms ? rooms.map((data) => (
          <MessageCard
            navigateRoom={navigateRoom}
            data={data}
            key={data.id}
          />
        )) : null}
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('search-user')} style={styles.newChatButton}>
        <Image source={newIcons} style={styles.newChatIcon} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: color.mainColor,
    flex: 1,
    margin: 0,
  },
  headers: {
    marginTop: 60,
    marginLeft: 20,
  },
  TextInputContainer: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: color.mainColor,
    borderColor: color.gray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  TextInput: {
    width: '90%',
    marginLeft: 10,
    backgroundColor: color.mainColor,
    color: color.white,
  },
  newChatButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#262337',
    padding: 17,
    borderRadius: 50,
  },
  newChatIcon: {
    width: 24,
    height: 25,
  },
});

export default HomeScreen;
