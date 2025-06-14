import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegexTester from '../src/features/regexTester/components/organisms/RegexTester';

export default function RegexTesterScreen() {
  return (
    <View style={styles.container}>
      <RegexTester />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
