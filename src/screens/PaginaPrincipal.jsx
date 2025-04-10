import React, { useEffect, useState, useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import * as Network from 'expo-network';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../style/GlobalStyles';
import { ESP32IpContext } from '../context/ESP32IpContext';

const PaginaPrincipal = () => {
  const [informacionRed, setInformacionRed] = useState(null);
  const navigation = useNavigation();
  const { esp32Ip } = useContext(ESP32IpContext);

  useEffect(() => {
    const obtenerInformacionRed = async () => {
      const estado = await Network.getNetworkStateAsync();
      setInformacionRed(estado);
    };

    obtenerInformacionRed();
    if (!esp32Ip) {
      navigation.replace('ConfiguracionWiFi');
    }
  }, [esp32Ip]);

  return (
    <SafeAreaView style={globalStyles.contenedor}>
      <Text style={globalStyles.titulo}>Información de Conexión</Text>
      <View style={globalStyles.contenedorInformacionRed}>
        {informacionRed ? (
          <>
            <Text style={globalStyles.texto}>Tipo: {informacionRed.type}</Text>
            <Text style={globalStyles.texto}>Conectado: {informacionRed.isConnected ? 'Sí' : 'No'}</Text>
            <Text style={globalStyles.texto}>IP ESP32: {esp32Ip || 'No configurada'}</Text>
          </>
        ) : (
          <Text style={globalStyles.texto}>Cargando...</Text>
        )}
      </View>
      
      <View style={globalStyles.botonesContainer}>

      <TouchableOpacity 
        style={globalStyles.botonPrimario}
        onPress={() => navigation.navigate('ConfiguracionWiFi')}
      > 
        <Text style={globalStyles.textoBoton}>Conectarce manualmente</Text>
      </TouchableOpacity>
      <View style={globalStyles.espacioBotones} />

      <TouchableOpacity 
        style={globalStyles.botonPrimario}
        onPress={() => navigation.navigate('ControlFoco')}
      >
        <Text style={globalStyles.textoBoton}>Controlar foco</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export default PaginaPrincipal;