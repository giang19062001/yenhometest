import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import io from 'socket.io-client';

// const SOCKET_URL = 'http://3.107.58.138/socket/userHomes'; // url
const SOCKET_URL = 'http://192.168.1.6:3502/socket/userHomes'; // url

const USER_CODE = 'USR000001';
const DATA = [
  {
    seq: 1,
    userCode: 'USR000001',
    userHomeCode: 'HOM000001',
    userHomeName: 'Nhà yến 1',
    userHomeAddress: '81 An giang',
    userHomeProvince: 'An Giang',
    userHomeDescription: 'nhà yến',
    isIntegateTempHum: 'Y',
    isIntegateCurrent: 'Y',
    isTriggered: 'Y',
    isMain: 'N',
  },
  {
    seq: 2,
    userCode: 'USR000001',
    userHomeCode: 'HOM000002',
    userHomeName: 'Nhà yến 2',
    userHomeAddress: '81 An giang',
    userHomeProvince: 'An Giang',
    isIntegateTempHum: 'Y',
    isIntegateCurrent: 'N',
    isTriggered: 'Y',
    isMain: 'N',
  },
  {
    seq: 3,
    userCode: 'USR000001',
    userHomeCode: 'HOM000003',
    userHomeName: 'Nhà yến 3',
    userHomeAddress: '81 An giang',
    userHomeProvince: 'An Giang',
    isIntegateTempHum: 'N',
    isIntegateCurrent: 'Y',
    isTriggered: 'Y',
    isMain: 'N',
  },
  {
    seq: 4,
    userCode: 'USR000001',
    userHomeCode: 'HOM000004',
    userHomeName: 'Nhà yến 4',
    userHomeAddress: '81 An giang',
    userHomeProvince: 'An Giang',
    isIntegateTempHum: 'N',
    isIntegateCurrent: 'N',
    isTriggered: 'N',
    isMain: 'N',
  },
];

const UserHomeScreen = ({ navigation }) => {
  const [homes, setHomes] = useState([]);
  const [sensorData, setSensorData] = useState({});

  const socketRef = useRef(null);

  // gọi api
  useEffect(() => {
    setHomes(DATA);
  }, []);

  // Navigation KHÔNG unmount screen thực sự -> disconnect ko được gọi  -> dùng useFocusEffect()
  useFocusEffect(
    useCallback(() => {
      // Khi screen được FOCUS -> connect socket
      if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL, {
          transports: ['websocket'],
        });

        socketRef.current.on('connect', () => {
          socketRef.current.emit('joinUserHomesRoom', {
            userCode: USER_CODE,
          });
        });

        socketRef.current.on('userhome-sensor-data', payload => {
          let newMap = {};
          payload.data.forEach(item => {
            newMap[item.userHomeCode] = {
              temperature: item.temperature,
              humidity: item.humidity,
              current: item.current,
            };
          });
          setSensorData(newMap);
        });
      }

      // Cleanup: Khi screen bị BLUR -> disconnect
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }, []), // chạy 1 lần
  );

  const renderItem = ({ item }) => {
    const rt = sensorData[item.userHomeCode];

    // ĐIỀU KIỆN HIỂN THỊ
    const showRealtime =
      item.isTriggered === 'Y' &&
      (item.isIntegateTempHum === 'Y' || item.isIntegateCurrent === 'Y');

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.userHomeName}</Text>
        <Text>
          {item.userHomeAddress} - {item.userHomeProvince}
        </Text>

        {showRealtime ? (
          <View style={styles.realtimeBox}>
            {item.isIntegateTempHum === 'Y' && (
              <>
                <Text>Nhiệt độ: {rt?.temperature ?? '--'} °C</Text>
                <Text>Độ ẩm: {rt?.humidity ?? '--'} %</Text>
              </>
            )}
            {item.isIntegateCurrent === 'Y' && (
              <>
                <Text>Dòng điện: {rt?.current ?? '--'} A</Text>
              </>
            )}
          </View>
        ) : (
          <Text style={styles.disabled}>Chưa kích hoạt</Text>
        )}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={homes}
        keyExtractor={item => item.userHomeCode}
        renderItem={renderItem}
        ListFooterComponent={
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Index')}
            >
              <Text style={styles.buttonText}>Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  realtimeBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  label: { fontSize: 16, fontWeight: '600', color: '#1565c0' },
  time: { fontSize: 12, color: '#666', marginTop: 5 },
  disabled: { color: '#999', fontStyle: 'italic', marginTop: 10 },
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

export default UserHomeScreen;
