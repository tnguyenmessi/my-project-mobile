import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const THDLogo = () => (
  <View style={styles.container}>
    {/* Thay thế bằng Image nếu có file logo */}
    <Text style={styles.logoText}>THD</Text>
    <Text style={styles.slogan}>The Innovative Technology Leader</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D32F2F',
    letterSpacing: 2,
  },
  slogan: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default THDLogo; 