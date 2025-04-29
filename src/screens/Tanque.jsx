import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { CambiaImagen, arrayImage, obtenerImagen } from '../componente/CambiaImagen';
import globalStyles from '../style/GlobalStyles'; 

const Tanque = () => {
  const [numero, setNumero] = useState(100); 

  const rellenarTanque = () => {
    setNumero(100); 
  };

  const imagenTanque = obtenerImagen(numero); 

  return (
    <View style={globalStyles.contenedor}>
      <Text style={globalStyles.titulo}>Nivel del Tanque: {numero}%</Text>

      {/* Imágenes de arriba */}
      <View style={globalStyles.imagenesArriba}>
        <Image source={arrayImage[0].image1} style={globalStyles.imagen} />
        <Image source={arrayImage[1].image1} style={globalStyles.imagen} />
      </View>

      {/* Imagen del tanque */}
      {imagenTanque && (
        <Image source={imagenTanque} style={globalStyles.imagenFoco} />
      )}

      {/* Imágenes de abajo */}
      <View style={globalStyles.imagenesAbajo}>
        <CambiaImagen
          image1={arrayImage[2].image1}
          image2={arrayImage[2].image2}
          setNumero={setNumero}
        />
        <CambiaImagen
          image1={arrayImage[3].image1}
          image2={arrayImage[3].image2}
          setNumero={setNumero}
        />
        <CambiaImagen
          image1={arrayImage[4].image1}
          image2={arrayImage[4].image2}
          setNumero={setNumero}
        />
      </View>

      {/* Botón para rellenar tanque */}
      <View style={globalStyles.botonesContainer}>
        <Button title="Rellenar Tanque" onPress={rellenarTanque} color="#03DAC6" />
      </View>
    </View>
  );
};

export default Tanque;
