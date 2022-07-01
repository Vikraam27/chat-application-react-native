import AsyncStorage from '@react-native-async-storage/async-storage';

class Token {
  static async Set(name, token) {
    try {
      return await AsyncStorage.setItem(name, token);
    } catch (error) {
      return error;
    }
  }

  static async Get(name) {
    try {
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error) {
      return error;
    }
  }

  static async Delete(name) {
    try {
      return await AsyncStorage.removeItem(name);
    } catch (error) {
      return error;
    }
  }
}

export default Token;
