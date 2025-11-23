import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.6:3502/UserHomeListSocket'; // url
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

  useEffect(() => {
    // if (socketRef.current) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    // kết nối và gửi sự kiện để join phòng danh sách yến
    socketRef.current.on('connect', () => {
      socketRef.current.emit('joinUserHomeListRoom', {
        userCode: USER_CODE,
      });
    });

    // Nhận toàn bộ data realtime của user
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
  }, [homes, homes.length]);

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
              onPress={() => navigation.navigate('PhoneAuth')}
            >
              <Text style={styles.buttonText}>Qua màn hình gửi OTP</Text>
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
