// components/ui/ParallaxScrollView.tsx

import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 250; // Altura fija del encabezado donde se muestra la imagen

type Props = PropsWithChildren<{
  headerImage: ReactElement; // Elemento React que se renderiza como imagen de encabezado
  headerBackgroundColor: { dark: string; light: string }; // Colores de fondo para tema oscuro y claro
}>;

/**
 * ParallaxScrollView: Contenedor con efecto parallax en el encabezado.
 * - headerImage se desplaza y escala al hacer scroll.
 * - children se muestran debajo del encabezado.
 */
export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  // Obtiene el tema actual ('light' o 'dark')
  const colorScheme = useColorScheme() ?? 'light';

  // Referencia animada para el ScrollView
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  // Valor animado del desplazamiento vertical
  const scrollOffset = useScrollViewOffset(scrollRef);

  // Espacio inferior para no tapar contenido con la barra de pestañas inferior
  const bottom = useBottomTabOverflow();

  // Estilo animado que aplica transformaciones según scrollOffset
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // Translación vertical en Y: parallax desplazando a mitad de velocidad
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          // Escala: agranda la imagen al sobrescroll (-HEADER_HEIGHT) y mantiene tamaño original al scrollear
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      {/* ScrollView animado que dispara eventos para actualizar scrollOffset */}
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16} // 60fps
        scrollIndicatorInsets={{ bottom }} // ajuste para barra inferior
        contentContainerStyle={{ paddingBottom: bottom }} // espacio al final
      >
        {/* Encabezado animado con parallax */}
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle, // aplica translateY y scale
          ]}
        >
          {headerImage}
        </Animated.View>

        {/* Contenido principal se coloca debajo del encabezado */}
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda la pantalla
  },
  header: {
    height: HEADER_HEIGHT, // altura definida
    overflow: 'hidden',    // recorta contenido que sale del área
  },
  content: {
    flex: 1,
    padding: 32,  // espacio interno alrededor del contenido
    gap: 16,      // espacio entre elementos hijos (React Native 0.70+)
    overflow: 'hidden',
  },
});
