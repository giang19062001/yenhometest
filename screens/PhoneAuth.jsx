import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function PhoneAuthScreen({ navigation }) {
  const [phone, setPhone] = useState('+84334644324');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const sendOTP = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmation);
      Alert.alert('ĐÃ GỬI!', 'Kiểm tra tin nhắn từ Firebase');
    } catch (e) {
      Alert.alert('Lỗi', e.code || e.message);
    }
  };

  const confirmCode = async () => {
    try {
      await confirm.confirm(code);
      Alert.alert('THÀNH CÔNG!', 'Đăng nhập OK!');
    } catch (e) {
      Alert.alert('Sai mã', 'Nhập lại mã OTP');
    }
  };

  return (
    <View style={styles.container}>
      {!confirm ? (
        <>
          <Text style={styles.title}>Gửi OTP Firebase</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
          <Button title="GỬI OTP NGAY" onPress={sendOTP} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Nhập mã OTP</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button title="XÁC NHẬN" onPress={confirmCode} />
        </>
      )}

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
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 18,
  },
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
