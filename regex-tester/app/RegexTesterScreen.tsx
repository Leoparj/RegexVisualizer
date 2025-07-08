import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RegexTester from '../src/features/regexTester/components/organisms/RegexTester';
import { initRegexTable } from '../src/features/regexTester/store/regexDbService';

export default function RegexTesterScreen() {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await initRegexTable();
        // Si quieres hacer pruebas de guardar y leer aquí, agrégalas:
        // await saveRegex('^[a-z]+$', 'Solo letras minúsculas', 0);
        // const todas = await getAllRegexes();
        // console.log('Expresiones guardadas:', todas);
      } catch (error: any) {
        setHasError(true);
        setErrorMessage(error?.message || 'Error inicializando la base de datos');
      }
    })();
  }, []);

  if (hasError) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Ocurrió un error al inicializar.</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
    );
  }

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
