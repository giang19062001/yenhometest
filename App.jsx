import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PhoneAuthScreen from './screens/PhoneAuth';
import Notify from './screens/Notify';
import UserHomeScreen from './screens/UserHome';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='UserHome'>
      <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
      <Stack.Screen name="Notify" component={Notify} />
      <Stack.Screen name="UserHome" component={UserHomeScreen} />
    </Stack.Navigator>
  );
}

export default App;
