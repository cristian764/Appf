import { StyleSheet } from 'react-native';

export const placeholderColor = '#AAAAAA'; 

const globalStyles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },

  titulo: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 25,
    color: '#03DAC6',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    backgroundColor: '#1E1E1E',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#03DAC655',
  },

  texto: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 12,
    paddingHorizontal: 10,
    lineHeight: 22,
  },

  error: {
    color: '#CF6679',
    marginTop: 20,
    fontSize: 16,
    backgroundColor: '#2D0008',
    padding: 12,
    borderRadius: 5,
    textAlign: 'center',
  },

  input: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: '#03DAC6',
    borderRadius: 4,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    placeholderTextColor: "#FFFFFF",
    fontSize: 16,
  },

  contenedorInformacionRed: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#03DAC6',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  imagenFoco: {
    width: 140,
    height: 140,
    marginVertical: 25,
    borderRadius: 8,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#03DAC6',
    backgroundColor: '#1E1E1E',
    resizeMode: 'contain',
  },

  botonesContainer: {
    marginTop: 15,
    alignItems: 'center',
  },

  espacioBotones: {
    marginVertical: 12,
  },

  botonPrimario: {
    backgroundColor: '#03DAC6',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },

  textoBoton: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.1,
  },

  contenedorCentrado: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  inputCompacto: {
    height: 44,
    marginBottom: 15,
  },

  header: {
    backgroundColor: '#1E1E1E',
  },

  headerTitle: {
    color: '#03DAC6',
    fontSize: 20,
    fontWeight: 'bold',
  },

  headerBackButton: {
    color: '#03DAC6',
  },

  imagenesArriba: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  imagenesAbajo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  imagen: {
    width: 120,
    height: 120,
    marginHorizontal: 10,
    resizeMode: 'contain',
  },
});

export default globalStyles;
