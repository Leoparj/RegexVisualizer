// components/ui/HapticTab.tsx

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

/**
 * HapticTab: botón de pestaña personalizado que agrega retroalimentación háptica
 * en iOS al presionar la pestaña.
 *
 * @param props - props estándar de un botón de barra de pestañas de React Navigation.
 */
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props} // Propagamos todas las props originales (estilo, onPress, etc.)
      onPressIn={(ev) => {
        // Solo en iOS (EXPO_OS==='ios') activamos feedback háptico suave.
        if (process.env.EXPO_OS === 'ios') {
          // impactAsync dispara una vibración ligera al tocar la pestaña.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Llamamos también al callback original onPressIn si estaba definido.
        props.onPressIn?.(ev);
      }}
    />
  );
}
