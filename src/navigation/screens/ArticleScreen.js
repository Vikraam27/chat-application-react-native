import * as React from 'react';
import { WebView } from 'react-native-webview';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import color from '../../styles/color';

export default function ArticleScreen({ navigation, route }) {
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 30, height: 30, marginLeft: 10, marginRight: 35, marginTop: 9,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={27}
            color="white"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{route.params.item.title.length < 30 ? route.params.item.title : `${route.params.item.title.substring(0, 30)}...`}</Text>
      </View>
      <WebView
        style={styles.container}
        source={{ uri: route.params.item.link }}
      />

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.mainColor,
    height: 80,
  },
  headerText: {
    marginTop: 9,
    fontSize: 20,
    color: color.white,
    textAlign: 'center',
  },
});
