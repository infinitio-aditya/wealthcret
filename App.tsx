import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";

import { AlertProvider } from "./src/context/AlertContext";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AlertProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AlertProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
