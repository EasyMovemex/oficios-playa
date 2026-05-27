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

export default function TermsScreen() {
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
          Términos y Condiciones
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, marginBottom: 24 }}>
          Última actualización: mayo 2025
        </Text>

        <Section title="1. Descripción del Servicio">
          <P>
            OficiosPlaya es una plataforma digital de intermediación que conecta a personas que necesitan
            servicios del hogar ("Clientes") con prestadores de servicios independientes ("Prestadores")
            en la zona de Playa del Carmen, Quintana Roo, México.
          </P>
          <P>
            OficiosPlaya <Text style={{ fontFamily: F.semiBold }}>no es un prestador de servicios</Text>.
            Actuamos exclusivamente como intermediario tecnológico. Los contratos de servicio se celebran
            directamente entre el Cliente y el Prestador, siendo estos últimos profesionales independientes
            y no empleados ni representantes de OficiosPlaya.
          </P>
        </Section>

        <Section title="2. Aceptación de los Términos">
          <P>
            Al crear una cuenta y utilizar la aplicación, aceptás estos Términos y Condiciones en su
            totalidad. Si no estás de acuerdo, no podés usar la plataforma. El uso continuado después
            de cambios publicados implica aceptación de los nuevos términos.
          </P>
        </Section>

        <Section title="3. Registro y Cuenta">
          <Li>Debés ser mayor de 18 años para registrarte.</Li>
          <Li>La información que proporcionás debe ser veraz, completa y actualizada.</Li>
          <Li>Sos responsable de mantener la confidencialidad de tu contraseña.</Li>
          <Li>No podés crear cuentas falsas ni suplantar la identidad de terceros.</Li>
          <Li>Cada persona puede tener una única cuenta activa.</Li>
        </Section>

        <Section title="4. Obligaciones del Prestador">
          <Li>Proporcionar información veraz sobre sus habilidades, experiencia y servicios ofrecidos.</Li>
          <Li>Cumplir con los servicios acordados en el precio, plazo y condiciones pactadas.</Li>
          <Li>Tratar a los clientes con respeto y profesionalismo en todo momento.</Li>
          <Li>Contar con los permisos, licencias o habilitaciones que su oficio requiera.</Li>
          <Li>No solicitar pagos fuera de la plataforma para eludir comisiones.</Li>
          <Li>Mantener actualizado su perfil con información precisa de cobertura y disponibilidad.</Li>
        </Section>

        <Section title="5. Obligaciones del Cliente">
          <Li>Proporcionar información clara y precisa en sus solicitudes de servicio.</Li>
          <Li>Respetar el precio y condiciones acordadas con el prestador.</Li>
          <Li>Tratar a los prestadores con respeto y dignidad.</Li>
          <Li>Realizar los pagos acordados en tiempo y forma.</Li>
          <Li>No publicar solicitudes fraudulentas o con fines distintos a contratar un servicio.</Li>
        </Section>

        <Section title="6. Limitación de Responsabilidad">
          <P>
            OficiosPlaya actúa como plataforma de conexión y <Text style={{ fontFamily: F.semiBold }}>
            no garantiza la calidad, seguridad, legalidad ni cumplimiento</Text> de los servicios
            prestados por los Prestadores independientes.
          </P>
          <P>
            En ningún caso OficiosPlaya será responsable por daños directos, indirectos, incidentales
            o consecuentes derivados del servicio contratado entre Usuario y Prestador, incluyendo pero
            no limitado a daños materiales, lesiones personales o pérdidas económicas.
          </P>
          <P>
            Recomendamos a los Clientes verificar las reseñas, solicitar presupuesto detallado y, para
            trabajos de mayor envergadura, solicitar referencias adicionales antes de contratar.
          </P>
        </Section>

        <Section title="7. Causales de Suspensión o Eliminación de Cuenta">
          <P>OficiosPlaya podrá suspender o eliminar una cuenta ante:</P>
          <Li>Información falsa o fraudulenta en el perfil.</Li>
          <Li>Conducta irrespetuosa, acoso o amenazas hacia otros usuarios.</Li>
          <Li>Incumplimiento reiterado de los servicios acordados.</Li>
          <Li>Uso de la plataforma para actividades ilegales.</Li>
          <Li>Manipulación de reseñas o calificaciones.</Li>
          <Li>Evasión de pagos o acuerdos realizados fuera de la plataforma.</Li>
          <Li>Tres o más reportes fundados de otros usuarios en un período de 90 días.</Li>
        </Section>

        <Section title="8. Propiedad Intelectual">
          <P>
            Todo el contenido de la plataforma (diseño, logos, textos, software) es propiedad de
            OficiosPlaya o sus licenciantes y está protegido por las leyes de propiedad intelectual
            mexicanas. Las fotos subidas por los Prestadores son de su propiedad, pero otorgan a
            OficiosPlaya una licencia de uso no exclusiva para mostrarlas en la plataforma.
          </P>
        </Section>

        <Section title="9. Modificaciones">
          <P>
            OficiosPlaya se reserva el derecho de modificar estos Términos en cualquier momento.
            Los cambios se notificarán mediante aviso en la aplicación con al menos 15 días de anticipación
            para cambios sustanciales.
          </P>
        </Section>

        <Section title="10. Jurisdicción">
          <P>
            Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier
            controversia derivada del uso de la plataforma, las partes se someten a la jurisdicción
            de los Tribunales competentes de Playa del Carmen, Quintana Roo, México, renunciando
            a cualquier otro fuero que pudiera corresponderles.
          </P>
        </Section>

        <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
          Contacto: lautaro.michelli@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
