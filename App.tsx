import 'react-native-reanimated';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store';
import RootNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/app/contexts/AuthContext';
import { AlertProvider } from './src/context/AlertContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

const App = (): React.JSX.Element => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ReduxProvider store={store}>
            <AuthProvider>
              <AlertProvider>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </AlertProvider>
            </AuthProvider>
          </ReduxProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;
