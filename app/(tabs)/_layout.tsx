import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="cliente"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="transportista"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="agenda"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="confirmacion"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="registro"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="login"
        options={{ href: null }}
/>
    </Tabs>
  );
}