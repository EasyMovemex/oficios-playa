import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const F = {
  regular: 'Poppins_400Regular' as const,
  medium: 'Poppins_500Medium' as const,
  semiBold: 'Poppins_600SemiBold' as const,
  bold: 'Poppins_700Bold' as const,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: Colors.textPrimary, marginBottom: 8 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontFamily: F.regular, fontSize: 13, color: Colors.textSecondary, lineHeight: 21, marginBottom: 6 }}>
      {children}
    </Text>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
      <Text style={{ fontFamily: F.regular, fontSize: 13, color: Colors.textSecondary }}>•</Text>
      <Text style={{ fontFamily: F.regular, fontSize: 13, color: Colors.textSecondary, lineHeight: 21, flex: 1 }}>
        {children}
      </Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1, borderBottomColor: Colors.border,
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: F.bold, fontSize: 17, color: Colors.textPrimary, flex: 1 }}>
          Política de Privacidad
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, marginBottom: 24 }}>
          Última actualización: mayo 2025
        </Text>

        <Section title="1. Responsable del Tratamiento">
          <P>
            De conformidad con la <Text style={{ fontFamily: F.semiBold }}>Ley Federal de Protección
            de Datos Personales en Posesión de los Particulares (LFPDPPP)</Text> y su Reglamento,
            OficiosPlaya, con domicilio en Playa del Carmen, Quintana Roo, México, es responsable
            del tratamiento de los datos personales que nos proporcionás.
          </P>
          <P>
            Contacto del responsable:{' '}
            <Text style={{ fontFamily: F.medium, color: Colors.primary }}>
              lautaro.michelli@gmail.com
            </Text>
          </P>
        </Section>

        <Section title="2. Datos Personales que Recolectamos">
          <P>Recolectamos los siguientes datos personales:</P>
          <Li><Text style={{ fontFamily: F.medium }}>Datos de identificación:</Text> nombre completo.</Li>
          <Li><Text style={{ fontFamily: F.medium }}>Datos de contacto:</Text> dirección de correo electrónico y número de teléfono (WhatsApp).</Li>
          <Li><Text style={{ fontFamily: F.medium }}>Datos de perfil:</Text> fotografía de perfil, logo o imágenes de trabajos realizados (portafolio) proporcionadas voluntariamente.</Li>
          <Li><Text style={{ fontFamily: F.medium }}>Datos de actividad:</Text> solicitudes de servicio, ofertas enviadas, reseñas y calificaciones.</Li>
          <Li><Text style={{ fontFamily: F.medium }}>Datos técnicos:</Text> token de notificaciones push del dispositivo, para el envío de alertas relacionadas con tus actividades en la plataforma.</Li>
          <P style={{ marginTop: 6 }}>
            No recolectamos datos financieros, bancarios ni de tarjetas de crédito. Los pagos se
            acuerdan y realizan directamente entre Usuario y Prestador fuera de la plataforma.
          </P>
        </Section>

        <Section title="3. Finalidad del Tratamiento">
          <P>Tus datos personales se utilizan exclusivamente para:</P>
          <Li>Crear y gestionar tu cuenta en la plataforma.</Li>
          <Li>Conectarte con prestadores de servicios o clientes según tu rol.</Li>
          <Li>Mostrar tu perfil público a otros usuarios de la plataforma.</Li>
          <Li>Enviarte notificaciones sobre actividad relevante (nuevas solicitudes, respuestas, reservas).</Li>
          <Li>Mejorar el funcionamiento y la seguridad de la plataforma.</Li>
          <Li>Cumplir con obligaciones legales aplicables.</Li>
          <P style={{ marginTop: 6 }}>
            No utilizamos tus datos para publicidad de terceros ni los vendemos a ninguna empresa.
          </P>
        </Section>

        <Section title="4. Compartición de Datos">
          <P>
            Compartimos datos únicamente en los siguientes casos:
          </P>
          <Li>
            <Text style={{ fontFamily: F.medium }}>Con otros usuarios:</Text> tu nombre, foto de perfil,
            zona de cobertura y servicios ofrecidos son visibles públicamente dentro de la plataforma
            para facilitar la conexión entre usuarios.
          </Li>
          <Li>
            <Text style={{ fontFamily: F.medium }}>Con proveedores de tecnología:</Text> utilizamos
            Supabase (infraestructura en la nube) para el almacenamiento seguro de datos, sujeto a
            sus propias políticas de privacidad.
          </Li>
          <Li>
            <Text style={{ fontFamily: F.medium }}>Por obligación legal:</Text> ante requerimiento
            de autoridades competentes conforme a la legislación mexicana.
          </Li>
        </Section>

        <Section title="5. Derechos ARCO">
          <P>
            Conforme a la LFPDPPP, tenés derecho a:
          </P>
          <Li><Text style={{ fontFamily: F.medium }}>Acceso:</Text> conocer qué datos personales tenemos sobre vos y cómo los usamos.</Li>
          <Li><Text style={{ fontFamily: F.medium }}>Rectificación:</Text> corregir datos inexactos o incompletos.</Li>
          <Li><Text style={{ fontFamily: F.medium }}>Cancelación:</Text> solicitar la eliminación de tus datos cuando ya no sean necesarios para la finalidad que motivó su tratamiento.</Li>
          <Li><Text style={{ fontFamily: F.medium }}>Oposición:</Text> oponerte al tratamiento de tus datos para finalidades específicas.</Li>
          <P style={{ marginTop: 6 }}>
            Para ejercer cualquiera de estos derechos, enviá un correo a{' '}
            <Text style={{ fontFamily: F.medium, color: Colors.primary }}>lautaro.michelli@gmail.com</Text>
            {' '}con asunto "Derechos ARCO" indicando tu nombre, email de cuenta y el derecho que
            querés ejercer. Responderemos en un plazo máximo de 20 días hábiles.
          </P>
        </Section>

        <Section title="6. Revocación del Consentimiento">
          <P>
            Podés revocar el consentimiento otorgado para el tratamiento de tus datos en cualquier
            momento enviando una solicitud a lautaro.michelli@gmail.com. La revocación no tendrá
            efectos retroactivos y puede implicar la imposibilidad de continuar utilizando la plataforma.
          </P>
        </Section>

        <Section title="7. Seguridad de los Datos">
          <P>
            Implementamos medidas técnicas y administrativas para proteger tus datos personales contra
            acceso no autorizado, pérdida, alteración o divulgación. Tus contraseñas se almacenan
            cifradas y las comunicaciones se realizan mediante protocolos seguros (HTTPS/TLS).
          </P>
          <P>
            Ante una vulneración de seguridad que afecte significativamente tus derechos, te notificaremos
            de inmediato conforme lo establece la LFPDPPP.
          </P>
        </Section>

        <Section title="8. Transferencias Internacionales">
          <P>
            Los datos se almacenan en servidores de Supabase, que puede procesar información en
            distintas jurisdicciones. Supabase cumple con estándares internacionales de seguridad
            (SOC 2 Type II). Al aceptar esta política, consentís dicha transferencia internacional.
          </P>
        </Section>

        <Section title="9. Cambios a esta Política">
          <P>
            Podemos actualizar esta Política de Privacidad. Los cambios se notificarán mediante
            aviso en la aplicación. Te recomendamos revisarla periódicamente. El uso continuado
            de la plataforma implica la aceptación de los cambios.
          </P>
        </Section>

        <Section title="10. Contacto">
          <P>
            Para cualquier consulta sobre esta Política de Privacidad o el tratamiento de tus datos:
          </P>
          <P>
            <Text style={{ fontFamily: F.medium }}>Email: </Text>
            <Text style={{ fontFamily: F.medium, color: Colors.primary }}>lautaro.michelli@gmail.com</Text>
          </P>
          <P>
            <Text style={{ fontFamily: F.medium }}>Domicilio: </Text>
            Playa del Carmen, Quintana Roo, México.
          </P>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
