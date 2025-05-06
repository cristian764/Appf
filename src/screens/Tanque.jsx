import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import globalStyles from '../style/GlobalStyles';
import { ESP32IpContext } from '../context/ESP32IpContext';
import * as SecureStore from 'expo-secure-store';

const imagenesTanque = [
  require('../../assets/imagenes/c1.jpg'),
  require('../../assets/imagenes/c2.jpg'),
  require('../../assets/imagenes/c3.jpg'),
  require('../../assets/imagenes/c4.jpg'),
  require('../../assets/imagenes/c5.jpg'),
];

const Tanque = () => {
  const { esp32Ip } = useContext(ESP32IpContext);
  const [altura, setAltura] = useState(50);
  const [radio, setRadio] = useState(30);
  const [nivelAgua, setNivelAgua] = useState(null);
  const [temperatura, setTemperatura] = useState(null);
  const [humedad, setHumedad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [nuevaAltura, setNuevaAltura] = useState('');
  const [nuevoRadio, setNuevoRadio] = useState('');

  const API_BASE_URL = `http://${esp32Ip}:8080`;

  const fetchStatus = () => {
    fetch(`${API_BASE_URL}/status`)
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener datos del sensor');
        return response.json();
      })
      .then((data) => {
        setTemperatura(data.temperatura);
        setHumedad(data.humedad);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Error de conexión');
      });
  };

  const fetchNivelAgua = () => {
    fetch(`${API_BASE_URL}/nivelAgua`)
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener nivel de agua');
        return response.json();
      })
      .then((data) => {
        const distancia = data.nivelAgua;
        const nivel = altura - distancia;
        setNivelAgua(nivel < 0 ? 0 : nivel);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Error de conexión');
        setNivelAgua(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cargarConfiguracion = async () => {
    const alturaGuardada = await SecureStore.getItemAsync('altura');
    const radioGuardado = await SecureStore.getItemAsync('radio');
    if (alturaGuardada) setAltura(parseFloat(alturaGuardada));
    if (radioGuardado) setRadio(parseFloat(radioGuardado));
  };

  const guardarConfiguracion = async () => {
    const nuevaAlt = parseFloat(nuevaAltura);
    const nuevoRad = parseFloat(nuevoRadio);

    if (isNaN(nuevaAlt) || isNaN(nuevoRad) || nuevaAlt <= 0 || nuevoRad <= 0) {
      Alert.alert('Error', 'Por favor ingresa valores válidos y mayores a 0.');
      return;
    }

    await SecureStore.setItemAsync('altura', nuevaAlt.toString());
    await SecureStore.setItemAsync('radio', nuevoRad.toString());
    setAltura(nuevaAlt);
    setRadio(nuevoRad);
    setModalVisible(false);
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchNivelAgua();
    const interval = setInterval(() => {
      fetchStatus();
      fetchNivelAgua();
    }, 3000);

    return () => clearInterval(interval);
  }, [altura]);

  const volumenLitros = Math.PI * Math.pow(radio, 2) * (nivelAgua || 0) / 1000;

  const obtenerImagenTanque = () => {
    if (!nivelAgua || nivelAgua <= 0) return imagenesTanque[0];
    const porcentaje = (nivelAgua / altura) * 100;
    if (porcentaje <= 20) return imagenesTanque[0];
    if (porcentaje <= 40) return imagenesTanque[1];
    if (porcentaje <= 60) return imagenesTanque[2];
    if (porcentaje <= 80) return imagenesTanque[3];
    return imagenesTanque[4];
  };

  return (
    <View style={globalStyles.contenedor}>
      <Text style={globalStyles.titulo}>Estado del Tanque</Text>

      {error && <Text style={globalStyles.error}>{error}</Text>}

      <View style={globalStyles.contenedorInformacionRed}>
        {loading ? (
          <Text style={globalStyles.texto}>Cargando...</Text>
        ) : (
          <>
            <Text style={globalStyles.texto}>Altura total: {altura} cm</Text>
            <Text style={globalStyles.texto}>Radio: {radio} cm</Text>
            <Text style={globalStyles.texto}>Nivel de agua: {nivelAgua?.toFixed(2)} cm</Text>
            <Text style={globalStyles.texto}>Volumen: {volumenLitros.toFixed(2)} litros</Text>
            <Text style={globalStyles.texto}>Temperatura: {temperatura}°C</Text>
            <Text style={globalStyles.texto}>Humedad: {humedad}%</Text>
            <Text style={globalStyles.texto}>IP ESP32: {esp32Ip || 'No configurada'}</Text>
          </>
        )}
      </View>

      {!loading && !error && (
        <Image source={obtenerImagenTanque()} style={globalStyles.imagenFoco} />
      )}

      <TouchableOpacity
        onPress={() => {
          setNuevaAltura(altura.toString());
          setNuevoRadio(radio.toString());
          setModalVisible(true);
        }}
        style={globalStyles.botonPrimario}
      >
        <Text style={globalStyles.textoBoton}>Configurar Tanque</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={globalStyles.modalContainer}>
          <Text style={globalStyles.titulo}>Configurar Tanque</Text>

          <Text style={globalStyles.texto}>Altura (cm):</Text>
          <TextInput
            value={nuevaAltura}
            onChangeText={setNuevaAltura}
            keyboardType="numeric"
            style={globalStyles.input}
          />

          <Text style={globalStyles.texto}>Radio (cm):</Text>
          <TextInput
            value={nuevoRadio}
            onChangeText={setNuevoRadio}
            keyboardType="numeric"
            style={globalStyles.input}
          />

          <TouchableOpacity onPress={guardarConfiguracion} style={globalStyles.botonPrimario}>
            <Text style={globalStyles.textoBoton}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)} style={globalStyles.botonPrimario}>
            <Text style={globalStyles.textoBoton}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Tanque;
