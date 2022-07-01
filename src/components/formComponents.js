/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../styles/color';

export function Input({
  label,
  iconName,
  error,
  password,
  onFocus = () => {},
  ...props
}) {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={style.label}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error ? Colors.red : isFocused ? Colors.darkBlue : Colors.light,
            alignItems: 'center',
          },
        ]}
      >
        <Ionicons
          name={iconName}
          style={{ color: Colors.darkBlue, fontSize: 22, marginRight: 10 }}
        />
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={{
            color: Colors.white, flex: 1, height: 40, fontSize: 16,
          }}
          {...props}
        />
        {password && (
          <Ionicons
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
            style={{ color: Colors.darkBlue, fontSize: 22 }}
          />
        )}
      </View>
      {error && (
        <Text style={{ marginTop: 7, color: Colors.red, fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

export function OtpInput({
  error,
  onFocus = () => {},
  ...props
}) {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={{
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    }}
    >
      <View
        style={[
          style.inputOtpContainer,
          {
            borderColor: error ? Colors.red : isFocused ? Colors.darkBlue : Colors.light,
            alignItems: 'center',
          },
        ]}
      >
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          style={{
            color: Colors.white, flex: 1, height: 40, fontSize: 16, textAlign: 'center',
          }}
          keyboardType="number-pad"
          maxLength={6}
          {...props}
        />
      </View>
      {error && (
        <Text style={{ marginTop: 7, color: Colors.red, fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

export function CustomPicker({
  label,
  iconName,
  error,
  pickerItem,
  onFocus = () => {},
  ...props
}) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [pickerItems] = React.useState([...pickerItem]);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={style.label}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error ? Colors.red : isFocused ? Colors.darkBlue : Colors.light,
            alignItems: 'center',
          },
        ]}
      >
        <Ionicons
          name={iconName}
          style={{ color: Colors.darkBlue, fontSize: 22, marginRight: 10 }}
        />
        <Picker
          style={{
            color: Colors.white, flex: 1, height: 40,
          }}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          dropdownIconColor={Colors.white}
          {...props}
        >
          {pickerItems.map((val) => (
            <Picker.Item
              style={{ height: 30, color: Colors.black }}
              label={val[0].toUpperCase() + val.slice(1)}
              value={val}
              key={val}
            />
          ))}
        </Picker>
      </View>
      {error && (
        <Text style={{ marginTop: 7, color: Colors.red, fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

export function List({
  iconName, name, desc, onPress,
}) {
  return (
    <TouchableOpacity style={style.container} onPress={onPress}>
      <Ionicons name={iconName} color="white" size={28} />
      <View style={style.content}>
        <Text style={style.name}>{name}</Text>
        <Text style={style.desc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={28} color="white" />
    </TouchableOpacity>
  );
}

export function MessageInput({
  onFocus = () => {},
  ...props
}) {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <TextInput
      autoCorrect={false}
      onFocus={() => {
        onFocus();
        setIsFocused(true);
      }}
      onBlur={() => setIsFocused(false)}
      style={{
        color: Colors.white,
        flex: 1,
        height: 40,
        fontSize: 16,
        backgroundColor: '#312B46',
        borderRadius: 20,
        paddingHorizontal: 20,
      }}
      {...props}
    />
  );
}

const style = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: Colors.white,
  },
  inputContainer: {
    height: 55,
    backgroundColor: Colors.inputColor,
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 0.1,
  },
  inputOtpContainer: {
    height: 45,
    width: 180,
    backgroundColor: Colors.inputColor,
    paddingHorizontal: 15,
    borderWidth: 0.1,
  },
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  desc: {
    fontSize: 12,
    color: Colors.gray,
  },
});
