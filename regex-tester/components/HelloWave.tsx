// components/ui/HelloWave.tsx

import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';

/**
 * HelloWave: componente que anima un emoji de saludo con un efecto de balanceo.
 * Utiliza react-native-reanimated para repetir una secuencia de rotaciones.
 */
export function HelloWave() {
  // shared value que almacena el ángulo de rotación actual (en grados)
  const rotationAnimation = useSharedValue(0);

  // useEffect se ejecuta una sola vez al montar el componente
  useEffect(() => {
    // Configura la animación: alterna entre 25° y 0°,
    // usando withTiming para animar suavemente y withSequence para encadenar.
    // withRepeat hace que la secuencia se repita 4 veces.
    rotationAnimation.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 150 }), // gira a 25° en 150ms
        withTiming(0, { duration: 150 })   // regresa a 0° en 150ms
      ),
      4 // número de repeticiones de la secuencia completa
    );
  }, [rotationAnimation]);

  // useAnimatedStyle conecta la shared value con estilos de transform
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotationAnimation.value}deg`, // aplica rotación dinámica
      },
    ],
  }));

  return (
    // Animated.View aplica el estilo animado a su contenido
    <Animated.View style={animatedStyle}>
      {/* ThemedText muestra el emoji dentro de un texto que respeta tema */}
      <ThemedText style={styles.text}>👋</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Ajustes de estilo para el texto emoji
  text: {
    fontSize: 28,    // tamaño de fuente
    lineHeight: 32,  // altura de línea para centrar verticalmente
    marginTop: -6,   // corrige el alineamiento vertical en algunas plataformas
  },
});
