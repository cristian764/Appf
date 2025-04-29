import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import globalStyles from '../style/GlobalStyles';
import { ESP32IpContext } from '../context/ESP32IpContext';

const imagenApagado = require('../../assets/focoApagado.png');
const imagenPrendido = require('../../assets/focoPrendido.png');

const ControlFoco = () => {
  const { esp32Ip } = useContext(ESP32IpContext);
  const [lights, setLights] = useState({ foco1: false, foco2: false, foco3: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);

  const API_BASE_URL = `http://${esp32Ip}:8080`;

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (!response.ok) throw new Error('Error al obtener estado de focos');

      const data = await response.json();
      setLights(data.focos || { foco1: false, foco2: false, foco3: false });
      setError(null);
    } catch (err) {
      setError(err.message || 'Error de conexión');
    }
  };

  const toggleLight = async (foco) => {
    const newState = !lights[foco];
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/control/${foco}/${newState ? 'on' : 'off'}`);
      if (!response.ok) throw new Error('Error al cambiar el estado del foco');

      await fetchStatus(); // Actualiza el estado después del cambio
    } catch (err) {
      setError(err.message || 'Error de control');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus(); // Primera llamada
    pollingRef.current = setInterval(fetchStatus, 3000); // Cada 3 segundos

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return (
    <View style={globalStyles.contenedor}>
      <Text style={globalStyles.titulo}>Control de Focos</Text>

      {['foco1', 'foco2', 'foco3'].map((foco) => (
        <TouchableOpacity key={foco} onPress={() => toggleLight(foco)} style={{ marginBottom: 20 }}>
          <Image
            source={lights[foco] ? imagenPrendido : imagenApagado}
            style={globalStyles.imagenFoco}
          />
          <Text style={{ textAlign: 'center' }}>{foco.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}
    </View>
  );
};

export default ControlFoco;
