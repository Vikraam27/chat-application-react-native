import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableWithoutFeedback,
} from 'react-native';
import color from '../styles/color';

function NewsCard({ item, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={() => onPress()}>
      <View style={styles.container}>
        <Image
          source={{ uri: item.image_url !== null ? item.image_url : 'https://firebasestorage.googleapis.com/v0/b/mychat-storage.appspot.com/o/4097354%20(1).png?alt=media&token=2a85ff23-5a99-457f-beb4-437921148764' }}
          style={styles.image}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title.length < 60 ? item.title : `${item.title.substring(0, 60)}...`}</Text>
          <Text style={styles.body}>
            {(() => {
              if (item.description) {
                if (item.description.length < 100) {
                  return item.description;
                }
                return `${item.description.substring(0, 100)}...`;
              }
              if (item.description === null) {
                if (item.content !== null) {
                  if (item.content.length < 100) {
                    return item.content;
                  }
                  return `${item.content.substring(0, 100)}...`;
                }
              }
              return '';
            })()}

          </Text>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowRadius: 6,
    backgroundColor: color.secondaryColor,
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    flexWrap: 'wrap',
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: color.white,
    marginBottom: 3,
  },
  body: {
    flexWrap: 'wrap',
    marginHorizontal: 10,
    color: color.white,
    alignItems: 'center',
  },
});

export default NewsCard;
