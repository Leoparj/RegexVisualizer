//components/ui/ExternalLink.tsx
import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: Href & string; // Definimos href, asegurando que sea un string compatible con expo-router
};

/**
 * ExternalLink: componente que extiende el Link de expo-router
 * para abrir enlaces externos en un navegador dentro de la app nativa,
 * manteniendo el comportamiento normal en web.
 *
 * @param href - URL a la que apunta el enlace.
 * @param rest - Resto de las props heredadas de Link (sin href).
 */
export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank" // En web, abre en una nueva pestaña
      {...rest}       // Propagamos todas las demás props (style, children, etc.)
      href={href}     // Establecemos el destino del enlace
      onPress={async (event) => {
        // Si no estamos en web (iOS/Android), interceptamos el clic
        if (Platform.OS !== 'web') {
          event.preventDefault();       // Evita la navegación por defecto
          await openBrowserAsync(href); // Abre la URL en un navegador in-app
        }
      }}
    />
  );
}
