/* eslint-disable no-undef */
import { Ionicons } from '@expo/vector-icons';
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  View, StyleSheet, TouchableOpacity,
  ScrollView, Text, ActivityIndicator,
  StatusBar, Image, TouchableWithoutFeedback,
  TouchableHighlight, Linking,
} from 'react-native';
import socket from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { useToast } from 'react-native-toast-notifications';
import FetchAPI from '../../api';
import { MessageInput } from '../../components/formComponents';
import color from '../../styles/color';
import Token from '../../utils/AsyncStorage';
import UserInfoContex from '../../utils/Contex';
import pdfIcon from '../../icons/pdf.png';

export default function ChatScreen({ navigation, route }) {
  const [userinfo] = useContext(UserInfoContex);
  const [roomInfo, setRoomInfo] = useState(null);
  const [msg, setMsg] = useState('');
  const [roomid] = useState(route.params.roomid);
  const scrollViewRef = useRef();
  const toast = useToast();
  const io = socket.connect('http://localhost:5000', { transports: ['websocket'] });

  useEffect(async () => {
    if (roomid) {
      const accessToken = await Token.Get('accessToken');
      const res = await FetchAPI.getRoomDetails(roomid, accessToken);
      if (res.status === 'success') {
        setRoomInfo(res.data);
        console.log('recall');
      }
    }
  }, []);

  useEffect(() => {
    io.on('connect', () => {
      console.log('socket connceted');
    });
    io.emit('joinRoom', { roomId: roomid });
    io.on('msg', (data) => {
      setRoomInfo((prev) => ({
        ...prev,
        message: [
          ...prev.message,
          data,
        ],
      }));
      console.log('socket');
    });

    return (() => {
      io.disconnect();
    });
  }, []);

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
      const formdata = new FormData();
      const accessToken = await Token.Get('accessToken');
      formdata.append('data', { uri: result.uri, name: 'image', type: 'image/jpeg' });
      await FetchAPI.uploadPictureMessage(formdata, roomid, accessToken);
    }
  };

  const uploadDocumentHandler = async () => {
    const requestFile = await DocumentPicker.getDocumentAsync({});
    if (requestFile.type === 'success') {
      const formdata = new FormData();
      const accessToken = await Token.Get('accessToken');
      formdata.append('data', { uri: requestFile.uri, name: requestFile.name, type: requestFile.mimeType });
      await FetchAPI.uploadDocumentMessage(formdata, roomid, accessToken);
    }
  };

  const textToRef = (text) => {
    setMsg(text);
  };

  const onSubmit = async () => {
    const accessToken = await Token.Get('accessToken');
    const res = await FetchAPI.postMessage(msg, 'text', roomid, accessToken);
    if (res.status !== 'success') {
      toast.show('unable to send message', {
        type: 'customToast',
        data: {
          title: 'fail',
          color: color.red,
        },
      });
    }
    if (res.status === 'success') {
      io.emit('chatMsg', {
        ...res.data,
        roomId: roomid,
      });
      setMsg('');
    }
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
        {message.length ? message.map((data) => {
          if (data.messageType === 'document') {
            return (
              <TouchableWithoutFeedback
                key={data.timestamp}
                onPress={() => Linking.openURL(data.message)}
              >
                <View
                  key={data.timestamp}
                  style={[styles.documentMsgContainer,
                    data.sender === userinfo.owner ? styles.sender : styles.reciver]}
                >
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Image
                      style={{
                        width: 24,
                        height: 25,
                        marginRight: 10,
                      }}
                      source={pdfIcon}
                    />
                    <Text style={{ color: '#fff', fontStyle: 'italic' }}>Click here to open</Text>
                  </View>
                  <Text style={styles.timestamp}>
                    {`${(new Date(data.timestamp)).toLocaleDateString()} ${(new Date(data.timestamp)).toLocaleTimeString()}`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          }

          if (data.messageType === 'image') {
            return (
              <TouchableWithoutFeedback
                key={data.timestamp}
                onPress={() => navigation.navigate('img', { imgUrl: data.message })}
              >
                <View
                  key={data.timestamp}
                  style={[styles.imageMsgContainer,
                    data.sender === userinfo.owner ? styles.sender : styles.reciver]}
                >
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    source={{ uri: data.message }}
                  />

                  <Text style={styles.timestamp}>
                    {`${(new Date(data.timestamp)).toLocaleDateString()} ${(new Date(data.timestamp)).toLocaleTimeString()}`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          }

          return (
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
          );
        }) : null}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableHighlight onPress={() => uploadImageHandler()} style={styles.buttonContainer}>
          <Ionicons name="images-outline" size={20} color="#fff" />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => uploadDocumentHandler()} style={styles.buttonContainer}>
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
  imageMsgContainer: {
    position: 'relative',
    width: 300,
    height: 254,
    margin: 10,
    padding: 10,
    paddingBottom: 25,
  },
  documentMsgContainer: {
    position: 'relative',
    width: 180,
    margin: 10,
    padding: 10,
    paddingBottom: 10,
  },
});
