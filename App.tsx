import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";

import { AlertProvider } from "./src/context/AlertContext";
import { AuthProvider } from "./src/context/AuthContext";
import { CustomThemeProvider } from "./src/context/ThemeContext";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <CustomThemeProvider>
            <AuthProvider>
              <AlertProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </AlertProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
