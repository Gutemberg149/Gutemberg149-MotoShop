import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface LogoIconProps {
  size?: number;
  color?: string;
}

export function LogoIcon({ size = 26, color = '#38bdf8' }: LogoIconProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="motorbike" size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});