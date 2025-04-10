import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PaginaPrincipal from './src/screens/PaginaPrincipal';
import ConfiguracionWiFi from './src/screens/ConfiguracionWiFi';
import ControlFoco from './src/screens/ControlFoco';
import InicioSesion from './src/screens/InicioSesion';
import { ESP32IpProvider } from './src/context/ESP32IpContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ESP32IpProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="InicioSesion">
          <Stack.Screen name="InicioSesion" component={InicioSesion} />
          <Stack.Screen name="PaginaPrincipal" component={PaginaPrincipal} />
          <Stack.Screen name="ConfiguracionWiFi" component={ConfiguracionWiFi} />
          <Stack.Screen name="ControlFoco" component={ControlFoco} />
        </Stack.Navigator>
      </NavigationContainer>
    </ESP32IpProvider>
  );
}