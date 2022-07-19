import React from 'react';
import { View, Text, Button } from 'react-native';

export default function StatusScreen({ navigation }) {
  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>StatusScreen</Text>
      <Button onPress={() => navigation.navigate('img')} title="goto" />
    </View>
  );
}
