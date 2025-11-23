import React, {useEffect, useState} from 'react';
import {View, Text, Alert, PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function Notify() {
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
     <View style={{padding: 20}}>
      <Text>FCM Token:</Text>
      <Text selectable>{token}</Text>
    </View>
  );
}