/* eslint-disable react/destructuring-assignment */
import { View, Text } from 'react-native';
import color from '../styles/color';

export default function CustomToast({ toast }) {
  return (
    <View
      style={{
        minWidth: '90%',
        maxWidth: '90%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: color.mainColor,
        marginVertical: 4,
        borderRadius: 8,
        borderLeftColor: toast.data.color,
        borderLeftWidth: 6,
        justifyContent: 'center',
        paddingLeft: 16,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: color.white,
          fontWeight: 'bold',
        }}
      >
        {toast.data.title}
      </Text>
      <Text style={{ color: '#a3a3a3', marginTop: 2 }}>{toast.message}</Text>
    </View>
  );
}
