import { Linking } from 'react-native';

export function openWhatsApp(phone: string, name: string): void {
  const msg = encodeURIComponent(
    `Hola ${name}, te encontré en OficiosPlaya y me interesa tu servicio.`
  );
  Linking.openURL(`https://wa.me/52${phone}?text=${msg}`);
}
