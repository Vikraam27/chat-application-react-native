import React, { useState } from 'react';
import {
  ScrollView, View, TextInput, StyleSheet, TouchableOpacity, Text,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import color from '../../styles/color';
import FetchAPI from '../../api';
import Token from '../../utils/AsyncStorage';
import { ProfileCard } from '../../components/Card';

export default function SearchUserScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const onSubmit = async () => {
    const accessToken = await Token.Get('accessToken');
    const res = await FetchAPI.searchUser(query, accessToken);
    setResult(res.data);
  };

  const postRoom = async (participant) => {
    const accessToken = await Token.Get('accessToken');
    const res = await FetchAPI.createRoom(participant, accessToken);
    navigation.navigate('chat', { roomid: res.data.roomId });
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" style={{ marginHorizontal: 10 }} size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          onChangeText={(text) => setQuery(text)}
          style={styles.searchInput}
          placeholder="Search user ...."
          placeholderTextColor={color.gray}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
      </View>
      <View>
        {(() => {
          if (result !== null) {
            if (result.length !== 0) {
              return (
                result.map((data) => (
                  <ProfileCard onCreateRoom={postRoom} data={data} key={data.username} />
                ))
              );
            }
            return (
              <Text style={{
                fontSize: 15, color: '#fff', textAlign: 'center', margin: 20,
              }}
              >
                Not found
              </Text>
            );
          }
          return null;
        })()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: StatusBar.currentHeight,
    backgroundColor: color.mainColor,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginTop: 20,
  },
  searchInput: {
    color: color.white,
    flex: 1,
    height: 40,
    fontSize: 16,
    marginHorizontal: 10,
    borderBottomColor: color.white,
    borderBottomWidth: 1,
  },
});
