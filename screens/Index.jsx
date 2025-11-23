import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const IndexScreen = ({ navigation }) => {
  const [token, setToken] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserHome')}
      >
        <Text style={styles.buttonText}>Danh sách nhà yến</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PhoneAuth')}
      >
        <Text style={styles.buttonText}>OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Notify')}
      >
        <Text style={styles.buttonText}>FCM</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#aeb7bd',
    padding: 5,
    borderRadius: 0,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default IndexScreen;
