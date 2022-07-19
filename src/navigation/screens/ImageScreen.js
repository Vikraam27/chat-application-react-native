import React, { useState } from 'react';
import {
  ImageBackground, SafeAreaView,
} from 'react-native';

function ImageScreen({ route }) {
  const [imgUrl] = useState(route.params?.imgUrl);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
      <ImageBackground
        resizeMode="contain"
        source={{ uri: imgUrl }}
        style={{ height: '100%', width: '100%' }}
      />
    </SafeAreaView>
  );
}

export default ImageScreen;
