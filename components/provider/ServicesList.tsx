import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import type { ProviderWithDetails } from '@/hooks/useProviders';

type ServicesListProps = {
  services: ProviderWithDetails['provider_services'];
};

function formatPrice(service: ProviderWithDetails['provider_services'][number]): string {
  if (service.price_from === null) return service.price_unit;
  return `Desde $${service.price_from.toLocaleString('es-MX')} ${service.price_unit}`;
}

export function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) return null;

  return (
    <View>
      {services.map((service, index) => (
        <View
          key={service.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderBottomWidth: index < services.length - 1 ? 1 : 0,
            borderBottomColor: '#E2E8F0',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <Text style={{ fontSize: 22 }}>{service.service_categories.icon}</Text>
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: Colors.textPrimary }}>
              {service.service_categories.name}
            </Text>
          </View>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
            {formatPrice(service)}
          </Text>
        </View>
      ))}
    </View>
  );
}
