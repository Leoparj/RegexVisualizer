// components/ui/ThemedView.tsx

import { useThemeColor } from '@/hooks/useThemeColor';
import { View, type ViewProps } from 'react-native';

/**
 * Props de ThemedView:
 * - lightColor: color de fondo a usar en tema claro (opcional)
 * - darkColor: color de fondo a usar en tema oscuro (opcional)
 * - resto de props de View (style, children, etc.)
 */
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

/**
 * ThemedView: Componente View que adapta su color de fondo
 * según el tema (claro/oscuro) usando el hook useThemeColor.
 * Permite además sobreescribir colores por prop.
 */
export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  // Obtiene el color de fondo adecuado según el tema y props
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  // Renderiza una View con el fondo temático
  return (
    <View
      // Combina el backgroundColor calculado con cualquier estilo externo
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
