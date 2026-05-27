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

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
        <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: Colors.textPrimary, flex: 1 }}>
          {title}
        </Text>
      </View>
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

function Rule({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={{
      backgroundColor: Colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      gap: 12,
      borderLeftWidth: 3,
      borderLeftColor: Colors.primary,
    }}>
      <Text style={{ fontSize: 18, marginTop: 1 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 3 }}>
          {title}
        </Text>
        <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 }}>
          {description}
        </Text>
      </View>
    </View>
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

export default function CommunityScreen() {
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
          Política de la Comunidad
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <P>
          OficiosPlaya es una comunidad de personas que se ayudan entre sí. Estas reglas existen para
          que la experiencia sea positiva, segura y confiable para todos.
        </P>

        <View style={{ marginBottom: 24 }} />

        <Section title="Reglas para Prestadores" emoji="🔧">
          <Rule
            icon="✅"
            title="Perfil verídico"
            description="Tu perfil debe reflejar fielmente tus habilidades, experiencia y zona de cobertura. Fotos de portafolio deben ser de trabajos propios."
          />
          <Rule
            icon="🤝"
            title="Cumplir lo acordado"
            description="Si aceptás un trabajo, debés cumplirlo en el precio, plazo y calidad acordados. Los cancelaciones injustificadas afectan tu reputación."
          />
          <Rule
            icon="💬"
            title="Comunicación clara"
            description="Respondé las solicitudes con información precisa. Informá con anticipación si hay inconvenientes con un trabajo ya aceptado."
          />
          <Rule
            icon="🧑‍💼"
            title="Trato profesional"
            description="Tratar a todos los clientes con respeto, puntualidad y seriedad, independientemente del tamaño del trabajo."
          />
          <Rule
            icon="💰"
            title="Precios honestos"
            description="El precio ofertado es el que se cobra. No se aceptan aumentos injustificados una vez acordado el servicio."
          />
        </Section>

        <Section title="Reglas para Clientes" emoji="🔍">
          <Rule
            icon="📋"
            title="Solicitudes claras"
            description="Describí el trabajo con detalle: qué necesitás, dónde y cuándo. Esto permite recibir ofertas más precisas."
          />
          <Rule
            icon="💳"
            title="Pagar lo acordado"
            description="Honrá el precio pactado con el prestador. No renegociar el precio una vez iniciado o completado el trabajo."
          />
          <Rule
            icon="🤝"
            title="Trato respetuoso"
            description="Los prestadores son profesionales. El trato debe ser cordial y respetuoso en todo momento."
          />
          <Rule
            icon="⏰"
            title="Disponibilidad"
            description="Si coordinaste un horario con el prestador, asegurate de estar disponible. Cancelaciones repetidas perjudican a todos."
          />
        </Section>

        <Section title="Lo que nunca toleramos" emoji="🚫">
          <Li>Acoso, insultos, discriminación o amenazas hacia cualquier usuario.</Li>
          <Li>Publicar información falsa sobre servicios, precios o experiencia.</Li>
          <Li>Manipular o comprar reseñas y calificaciones.</Li>
          <Li>Usar la plataforma para actividades ilegales o fraudulentas.</Li>
          <Li>Compartir datos personales de otros usuarios sin su consentimiento.</Li>
          <Li>Evadir el pago por servicios ya prestados.</Li>
          <Li>Crear múltiples cuentas para eludir una suspensión.</Li>
        </Section>

        <Section title="Cómo reportar un problema" emoji="🚨">
          <P>
            Si experimentás o presenciás una conducta que viola estas reglas, escribinos a{' '}
            <Text style={{ fontFamily: F.medium, color: Colors.primary }}>lautaro.michelli@gmail.com</Text>
            {' '}con el asunto "Reporte de usuario" incluyendo:
          </P>
          <Li>Tu nombre y email de cuenta.</Li>
          <Li>Nombre o identificador del usuario reportado.</Li>
          <Li>Descripción del incidente con fecha y contexto.</Li>
          <Li>Capturas de pantalla u otra evidencia si la tenés.</Li>
          <P style={{ marginTop: 8 }}>
            Respondemos todos los reportes en un plazo de 72 horas hábiles. La identidad de quien
            reporta se mantiene confidencial.
          </P>
        </Section>

        <Section title="Proceso de Suspensión" emoji="⚖️">
          <P>
            Ante un reporte, OficiosPlaya investiga el caso y aplica las siguientes medidas según
            la gravedad:
          </P>
          <View style={{
            backgroundColor: Colors.surface,
            borderRadius: 12,
            overflow: 'hidden',
            marginTop: 4,
          }}>
            {[
              { nivel: 'Aviso', color: '#059669', desc: 'Notificación formal sobre la conducta infractora.' },
              { nivel: 'Suspensión temporal', color: '#F59E0B', desc: 'Cuenta bloqueada por 7 a 30 días según reincidencia.' },
              { nivel: 'Suspensión definitiva', color: '#EF4444', desc: 'Eliminación permanente ante faltas graves o reincidencia.' },
            ].map((item, i, arr) => (
              <View key={item.nivel} style={{
                flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: Colors.border,
              }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginTop: 4 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary }}>{item.nivel}</Text>
                  <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
          <P style={{ marginTop: 10 }}>
            Las suspensiones definitivas ante conductas que pongan en riesgo la seguridad de personas
            son inmediatas y sin posibilidad de apelación.
          </P>
        </Section>

        <Section title="Política de Reseñas" emoji="⭐">
          <P>
            Las reseñas son la base de la confianza en OficiosPlaya. Por eso:
          </P>
          <Li>Solo pueden dejar reseña quienes completaron efectivamente un servicio.</Li>
          <Li>Las reseñas no se modifican ni eliminan salvo que violen estas políticas.</Li>
          <Li>No compramos, vendemos ni manipulamos calificaciones de ningún tipo.</Li>
          <Li>Las reseñas falsas o de represalia son motivo de suspensión.</Li>
          <Li>El prestador puede responder públicamente a una reseña, una sola vez.</Li>
          <P style={{ marginTop: 6 }}>
            Si creés que una reseña sobre tu perfil es falsa o injusta, contactanos con evidencia
            y la analizaremos dentro de los 5 días hábiles siguientes.
          </P>
        </Section>

        <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
          Contacto: lautaro.michelli@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
