import React, { useState, useContext } from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import globalStyles from '../style/GlobalStyles';
import { ESP32IpContext } from '../context/ESP32IpContext';

export default function InicioSesion({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { esp32Ip } = useContext(ESP32IpContext);

  const userList = [
    { user: 'Kevin', pass: '123' },
    { user: 'Cristian', pass: '456' }
  ];

  const goIn = () => {
    const userFound = userList.some(
      ({ user, pass }) => user === usuario && pass === password
    );

    if (userFound) {
      if (esp32Ip) {
        navigation.replace('PaginaPrincipal');
      } else {
        navigation.replace('ConfiguracionWiFi');
      }
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={globalStyles.titulo}>Iniciar Sesión</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Nombre de Usuario"
          placeholderTextColor="#888"
          maxLength={25}
          value={usuario}
          onChangeText={setUsuario}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          maxLength={20}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={globalStyles.botonesContainer}>
          <TouchableOpacity style={globalStyles.botonPrimario} onPress={goIn}>
            <Text style={globalStyles.textoBoton}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
