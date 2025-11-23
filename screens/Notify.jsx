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
import messaging from '@react-native-firebase/messaging';

export default function Notify({navigation}) {
  const [token, setToken] = useState('');

  const init = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    await messaging().requestPermission();
    const fcmToken = await messaging().getToken();
    setToken(fcmToken);

    messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body,
      );
    });
  };

  console.log(token);
  useEffect(() => {
    init();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>FCM Token:</Text>
      <Text selectable>{token}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Index')}
      >
        <Text style={styles.buttonText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#aeb7bd',
    padding: 5,
    borderRadius: 0,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
