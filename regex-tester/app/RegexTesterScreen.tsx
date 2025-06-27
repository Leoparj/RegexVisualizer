import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RegexTester from '../src/features/regexTester/components/organisms/RegexTester';

export default function RegexTesterScreen() {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  try {
    if (hasError) {
      return (
        <View style={[styles.container, styles.center]}>
          <Text style={styles.errorText}>Ocurrió un error al renderizar.</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <RegexTester />
      </View>
    );
  } catch (error: any) {
    setHasError(true);
    setErrorMessage(error?.message || 'Error desconocido');
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
});
