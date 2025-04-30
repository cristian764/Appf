import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import globalStyles from '../style/GlobalStyles';
import { ESP32IpContext } from '../context/ESP32IpContext';

const imagenApagado = require('../../assets/focoApagado.png');
const imagenPrendido = require('../../assets/focoPrendido.png');

const ControlFoco = () => {
  const { esp32Ip } = useContext(ESP32IpContext);
  const [foco1, setFoco1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);

  const API_BASE_URL = `http://${esp32Ip}:8080`;

  const fetchStatus = () => {
    fetch(`${API_BASE_URL}/status`)
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener estado del foco');
        return response.json();
      })
      .then((data) => {
        setFoco1(data.focos?.foco1 || false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Error de conexión');
      });
  };

  const toggleLight = () => {
    const newState = !foco1;
    setLoading(true);

    fetch(`${API_BASE_URL}/control/foco1/${newState ? 'on' : 'off'}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error al cambiar el estado del foco');
        return fetch(`${API_BASE_URL}/status`);
      })
      .then((res) => res.json())
      .then((data) => {
        setFoco1(data.focos?.foco1 || false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Error de control');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStatus();
    pollingRef.current = setInterval(fetchStatus, 2000);
    return () => {
      if (pollingRef.current){
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return (
    <View style={globalStyles.contenedor}>
      <Text style={globalStyles.titulo}>Control de Foco</Text>

      <TouchableOpacity onPress={toggleLight} style={{ marginBottom: 20 }}>
        <Image
          source={foco1 ? imagenPrendido : imagenApagado}
          style={globalStyles.imagenFoco}
        />
        <Text style={{ textAlign: 'center' }}>FOCO1</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}
    </View>
  );
};

export default ControlFoco;
