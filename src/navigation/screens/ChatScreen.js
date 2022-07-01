import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView, TouchableHighlight, Text, ActivityIndicator,
} from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import FetchAPI from '../../api';
import { MessageInput } from '../../components/formComponents';
import color from '../../styles/color';
import Token from '../../utils/AsyncStorage';
import UserInfoContex from '../../utils/Contex';

export default function ChatScreen({ navigation, route }) {
  const [userinfo] = useContext(UserInfoContex);
  const [roomInfo, setRoomInfo] = useState(null);
  const [msg, setMsg] = useState('');
  const [roomid] = useState(route.params.roomid);
  const scrollViewRef = useRef();

  useEffect(async () => {
    if (roomid) {
      const accessToken = await Token.Get('accessToken');
      const res = await FetchAPI.getRoomDetails(roomid, accessToken);
      setRoomInfo(res.data);
    }
  }, []);

  const textToRef = (text) => {
    setMsg(text);
  };

  const onSubmit = async () => {
    const accessToken = await Token.Get('accessToken');
    const res = await FetchAPI.postMessage(msg, 'text', roomid, accessToken);
    setRoomInfo((prevState) => ({
      ...prevState,
      message: [
        ...prevState.message,
        res.data,
      ],
    }));
    setMsg('');
  };
  if (!roomInfo || !roomid) {
    return (
      <View style={{
        position: 'absolute', top: '50%', right: 0, left: 0,
      }}
      >
        <ActivityIndicator size="large" color={color.darkBlue} />
      </View>
    );
  }
  const {
    creator, creatorProfileUrl, participant, participantProfileUrl, message,
  } = roomInfo;
  return (
    <View style={styles.main}>
      <View style={styles.headers}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 30, height: 30, marginLeft: 10,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={27}
            color="white"
          />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          {(() => {
            if (userinfo.owner === creator) {
              if (participantProfileUrl) {
                return (
                  <Avatar
                    size={41}
                    rounded
                    source={{ uri: participantProfileUrl }}
                  />
                );
              }
              return (
                <Avatar
                  size={41}
                  rounded
                  title={participant[0]}
                  overlayContainerStyle={{ backgroundColor: '#9DBD62' }}
                  titleStyle={{ color: '#fff' }}
                />
              );
            }
            if (creatorProfileUrl) {
              return (
                <Avatar
                  size={41}
                  rounded
                  source={{ uri: creatorProfileUrl }}
                />
              );
            }
            return (
              <Avatar
                size={41}
                rounded
                title={creator[0]}
                overlayContainerStyle={{ backgroundColor: '#9DBD62' }}
                titleStyle={{ color: '#fff' }}
              />
            );
          })()}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.text}>{userinfo.owner === creator ? participant : creator}</Text>
          <Text style={styles.textGray}>data.status</Text>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
        style={styles.messageContent}
      >
        {message.length ? message.map((data) => (
          <View
            key={data.timestamp}
            style={[styles.message,
              data.sender === userinfo.owner ? styles.sender : styles.reciver]}
          >
            <Text style={styles.msgBody}>
              {data.message}
            </Text>
            <Text style={styles.timestamp}>
              {data.timestamp}
            </Text>
          </View>
        )) : null}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableHighlight onPress={() => console.log('o')} style={styles.buttonContainer}>
          <Ionicons name="images-outline" size={20} color="#fff" />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => console.log('o')} style={styles.buttonContainer}>
          <Ionicons name="attach" size={20} color="#fff" />
        </TouchableHighlight>
        <MessageInput
          onChangeText={textToRef}
          value={msg}
          onSubmitEditing={onSubmit}
        />
        <TouchableHighlight onPress={onSubmit} style={styles.buttonContainer}>
          <Ionicons name="send-outline" size={20} color="#fff" />
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  headers: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.mainColor,
    height: 80,
  },
  messageContent: {
    flex: 1,
    backgroundColor: color.secondaryColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: color.secondaryColor,
  },
  buttonContainer: {
    marginHorizontal: 5,
    backgroundColor: color.mainColor,
    padding: 10,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    marginLeft: 15,
  },
  headerInfo: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  textGray: {
    color: 'gray',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#fff',
  },
  message: {
    position: 'relative',
    margin: 20,
    padding: 10,
    minWidth: 170,
  },
  senderTitle: {
    fontWeight: '700',
    fontSize: 11,
    marginBottom: 3,
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    marginTop: 6,
    textAlign: 'right',
  },
  msgBody: {
    color: color.white,
    marginTop: 7,
  },
  sender: {
    backgroundColor: '#383054',
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 13,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  reciver: {
    backgroundColor: '#554885',
    alignSelf: 'flex-start',
    borderBottomRightRadius: 13,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
});
