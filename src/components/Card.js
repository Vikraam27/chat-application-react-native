import React, { useContext } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import color, { RandomColor } from '../styles/color';
import UserInfoContex from '../utils/Contex';

export function ProfileCard({ data, onCreateRoom }) {
  return (
    <TouchableOpacity onPress={() => onCreateRoom(data.username)} style={styles.container}>
      <View style={styles.profileContainer}>
        {data.profile_url ? (
          <Avatar
            size={50}
            rounded
            source={{ uri: data.profile_url }}
          />
        ) : (
          <Avatar
            size={50}
            rounded
            title={data.username[0]}
            overlayContainerStyle={{ backgroundColor: RandomColor() }}
            titleStyle={{ color: '#fff' }}
          />
        )}
      </View>
      <View style={styles.profileBody}>
        <Text style={styles.username}>{data.username}</Text>
        <Text style={styles.status}>{data.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function MessageCard({ data, navigateRoom }) {
  const [userinfo] = useContext(UserInfoContex);
  const {
    creator, creatorProfileUrl, participant, participantProfileUrl, id, lastMessage,
  } = data;
  return (
    <TouchableOpacity onPress={() => navigateRoom(id)} style={styles.container}>
      <View style={styles.profileContainer}>
        {(() => {
          if (userinfo.owner === creator) {
            if (participantProfileUrl) {
              return (
                <Avatar
                  size={50}
                  rounded
                  source={{ uri: participantProfileUrl }}
                />
              );
            }
            return (
              <Avatar
                size={50}
                rounded
                title={participant[0]}
                overlayContainerStyle={{ backgroundColor: RandomColor() }}
                titleStyle={{ color: '#fff' }}
              />
            );
          }
          if (creatorProfileUrl) {
            return (
              <Avatar
                size={50}
                rounded
                source={{ uri: creatorProfileUrl }}
              />
            );
          }
          return (
            <Avatar
              size={50}
              rounded
              title={creator[0]}
              overlayContainerStyle={{ backgroundColor: RandomColor() }}
              titleStyle={{ color: '#fff' }}
            />
          );
        })()}
      </View>
      <View style={styles.profileBody}>
        <Text style={styles.username}>{userinfo.owner === creator ? participant : creator}</Text>
        <Text style={styles.status}>{lastMessage ? lastMessage.message : 'start chat with your friends' }</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 10,
    paddingVertical: 1,
    backgroundColor: color.secondaryColor,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileContainer: {
    margin: 10,
  },
  username: {
    color: color.white,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 3,
  },
  status: {
    color: color.gray,
    fontSize: 14,
  },
  profileBody: {
    marginLeft: 10,
  },
});
