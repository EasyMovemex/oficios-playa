import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen name="provider/[id]" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="job/[id]" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="booking/[id]" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="new-request" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="new-bid" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}
