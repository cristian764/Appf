import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, Button, TextInput, Modal } from 'react-native';
import globalStyles, { placeholderColor }  from '../style/GlobalStyles';
import { ESP32IpContext } from '../context/ESP32IpContext';
import * as SecureStore from 'expo-secure-store';

const Tanque = () => {
  const { esp32Ip } = useContext(ESP32IpContext);
  const [nivelTanque, setNivelTanque] = useState(0);
  const [temperatura, setTemperatura] = useState(null);
  const [humedad, setHumedad] = useState(null);
  const [radio, setRadio] = useState(20); // cm
  const [alturaMaxima, setAlturaMaxima] = useState(100); // cm
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoRadio, setNuevoRadio] = useState('');
  const [nuevaAltura, setNuevaAltura] = useState('');

  const API_BASE_URL = `http://${esp32Ip}:8080`;

  const obtenerDatos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      const data = await response.json();
      setNivelTanque(data?.distancia || 0);
      setTemperatura(data?.temperatura || null);
      setHumedad(data?.humedad || null);
    } catch (error) {
      console.error('Error al obtener datos del sensor:', error);
    }
  };

  const obtenerImagenTanque = () => {
    if (nivelTanque >= alturaMaxima) {
      return require('../../assets/imagenes/c1.jpg'); // Vacío
    }
    const alturaAgua = alturaMaxima - nivelTanque;
    const porcentaje = (alturaAgua / alturaMaxima) * 100;

    if (porcentaje >= 80) return require('../../assets/imagenes/c5.jpg'); // Lleno
    if (porcentaje >= 60) return require('../../assets/imagenes/c4.jpg');
    if (porcentaje >= 40) return require('../../assets/imagenes/c3.jpg');
    if (porcentaje >= 20) return require('../../assets/imagenes/c2.jpg');
    return require('../../assets/imagenes/c1.jpg');
  };

  const calcularVolumen = () => {
    const alturaAgua = Math.max(0, alturaMaxima - nivelTanque);
    const volumenCm3 = Math.PI * Math.pow(radio, 2) * alturaAgua;
    return (volumenCm3 / 1000).toFixed(2); // en litros
  };

  const cargarConfiguracion = async () => {
    try {
      const alturaGuardada = await SecureStore.getItemAsync('alturaMaxima');
      const radioGuardado = await SecureStore.getItemAsync('radio');

      if (alturaGuardada) setAlturaMaxima(parseFloat(alturaGuardada));
      if (radioGuardado) setRadio(parseFloat(radioGuardado));
    } catch (e) {
      console.error('Error al cargar configuración', e);
    }
  };

  const guardarConfiguracion = async () => {
    try {
      const nuevaAlturaNum = parseFloat(nuevaAltura);
      const nuevoRadioNum = parseFloat(nuevoRadio);

      if (!isNaN(nuevaAlturaNum)) {
        setAlturaMaxima(nuevaAlturaNum);
        await SecureStore.setItemAsync('alturaMaxima', nuevaAltura);
      }
      if (!isNaN(nuevoRadioNum)) {
        setRadio(nuevoRadioNum);
        await SecureStore.setItemAsync('radio', nuevoRadio);
      }
      setModalVisible(false);
    } catch (e) {
      console.error('Error al guardar configuración', e);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
    obtenerDatos();
    const intervalo = setInterval(obtenerDatos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const imagenTanque = obtenerImagenTanque();

  return (
    <View style={globalStyles.contenedor}>
      <Text style={globalStyles.titulo}>Tanque de Agua</Text>

      <View style={globalStyles.contenedorInformacionRed}>
        <Text style={globalStyles.texto}>IP ESP32: {esp32Ip || 'No configurada'}</Text>
        <Text style={globalStyles.texto}>Altura Total: {alturaMaxima} cm</Text>
        <Text style={globalStyles.texto}>Radio: {radio} cm</Text>
        <Text style={globalStyles.texto}>Nivel del Agua: {(alturaMaxima - nivelTanque) >= 0 ? (alturaMaxima - nivelTanque).toFixed(1) : 0} cm</Text>
        <Text style={globalStyles.texto}>Volumen Estimado: {calcularVolumen()} litros</Text>
        <Text style={globalStyles.texto}>Temperatura: {temperatura ?? '---'} °C</Text>
        <Text style={globalStyles.texto}>Humedad: {humedad ?? '---'}%</Text>
      </View>

      {imagenTanque && (
        <Image source={imagenTanque} style={globalStyles.imagenFoco} />
      )}

      <View style={globalStyles.botonesContainer}>
        <Button title="Configurar Tanque" onPress={() => setModalVisible(true)} color="#03DAC6" />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={globalStyles.contenedor}>
          <Text style={globalStyles.titulo}>Configurar Tanque</Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Altura (cm)"
            placeholderTextColor={placeholderColor}
            keyboardType="numeric"
            value={nuevaAltura}
            onChangeText={setNuevaAltura}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Radio (cm)"
            placeholderTextColor={placeholderColor}
            keyboardType="numeric"
            value={nuevoRadio}
            onChangeText={setNuevoRadio}
          />

          <View style={globalStyles.botonesContainer}>
            <Button title="Guardar Configuración" onPress={guardarConfiguracion} color="#03DAC6" />
            <View style={globalStyles.espacioBotones} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#CF6679" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Tanque;
