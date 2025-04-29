import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

export const c1 = require('../../assets/imagenes/c1.jpg');
export const c2 = require('../../assets/imagenes/c2.jpg');
export const c3 = require('../../assets/imagenes/c3.jpg');
export const c4 = require('../../assets/imagenes/c4.jpg');
export const c5 = require('../../assets/imagenes/c5.jpg');

export const obtenerImagen = (numero) => {
  if (numero >= 1 && numero <= 20) return c1;
  else if (numero >= 21 && numero <= 40) return c2;
  else if (numero >= 41 && numero <= 60) return c3;
  else if (numero >= 61 && numero <= 80) return c4;
  else if (numero >= 81 && numero <= 100) return c5;
  else return null;
};

export const arrayImage = [
  { image1: require('../../assets/imagenes/carro1.png'), image2: require('../../assets/imagenes/carro2.gif') },
  { image1: require('../../assets/imagenes/lavamanos1.jpg'), image2: require('../../assets/imagenes/lavamanos2.gif') },
  { image1: require('../../assets/imagenes/plantas1.png'), image2: require('../../assets/imagenes/plantas2.gif') },
  { image1: require('../../assets/imagenes/regadera1.png'), image2: require('../../assets/imagenes/regadera2.gif') },
  { image1: require('../../assets/imagenes/tasa.jpg'), image2: require('../../assets/imagenes/tasa.jpg') },
];


export function CambiaImagen({ image1, image2, setNumero }) {
  const [actual, setActual] = useState(image1);

  const handlePress = () => {
    setActual(actual === image1 ? image2 : image1);
    setNumero(prevNumero => (prevNumero >= 5 ? prevNumero - 5 : 0)); 
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image source={actual} style={styles.Imagen} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  Imagen: {
    width: 100,
    height: 100,
    margin: 5,
    resizeMode: 'contain',
  },
});
