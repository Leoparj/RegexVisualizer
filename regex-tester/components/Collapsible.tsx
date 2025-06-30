//components/ui/Collapsible.tsx
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Componente Colapsable que muestra un encabezado clickable
 * y, al hacer clic, muestra u oculta su contenido.
 *
 * @param children - El contenido que se mostrará dentro del componente colapsable.
 * @param title - Texto que aparecerá en el encabezado como título.
 */
export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  // Estado local para controlar si el contenido está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);
  // Detecta el tema de color actual ('light' o 'dark')
  const theme = useColorScheme() ?? 'light';

  return (
    // Contenedor principal con estilo de tema
    <ThemedView>
      {/* Encabezado clickable: mostramos icono y título */}
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)} // Alterna isOpen al hacer clic
        activeOpacity={0.8} // Opacidad al presionar
      >
        {/* Icono de flecha que rota según el estado (abierto/cerrado) */}
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        {/* Título del colapsable con estilo seminegrita */}
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>

      {/* Contenido colapsable: solo se renderiza cuando isOpen es true */}
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',    // Icono y texto en fila
    alignItems: 'center',    // Centrar verticalmente
    gap: 6,                  // Espacio entre icono y texto
  },
  content: {
    marginTop: 6,            // Separación arriba del contenido
    marginLeft: 24,          // Sangría para diferenciar del encabezado
  },
});
