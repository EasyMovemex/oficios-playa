import { View, Text } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Pantalla no encontrada' }} />
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-text-primary font-poppins-bold text-xl mb-2">
          Página no encontrada
        </Text>
        <Link href="/" className="text-primary underline">
          Volver al inicio
        </Link>
      </View>
    </>
  );
}
