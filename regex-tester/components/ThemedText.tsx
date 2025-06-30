// components/ui/ThemedText.tsx

import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  // Colores opcionales para forzar color en temas claro/oscuro
  lightColor?: string;
  darkColor?: string;
  // Variantes tipográficas predefinidas
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

/**
 * ThemedText: componente de texto que adapta su color al tema
 * y ofrece varias variantes tipográficas.
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // useThemeColor devuelve el color adecuado según el tema y las props
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      // Aplica primero el color temático, luego la variante tipográfica y luego estilos externos
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Texto normal
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  // Texto normal con peso seminegrita
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  // Título grande y negrita
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  // Subtítulo mediano y negrita
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Estilo de enlace: color fijo y línea de base mayor
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
