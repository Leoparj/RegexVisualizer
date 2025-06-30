// Componente recursivo para explorar el AST en forma colapsable.
// Cada nodo puede expandirse/colapsarse para ver sus propiedades hijas.
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ASTNode({ node }: { node: any }) {
    const [expanded, setExpanded] = useState(true);

    // Validación: solo objetos con propiedades
    if (!node || typeof node !== 'object') return null;

    return (
        <View style={styles.container}>
            {/* Título clickeable para expandir/colapsar */}
            <Pressable onPress={() => setExpanded(!expanded)}>
                <Text style={styles.title}>
                    {expanded ? '[-]' : '[+]'} {node.type || 'Node'}
                </Text>
            </Pressable>

            {/* Si está expandido, recorremos propiedades para mostrarlas */}
            {expanded && (
                <View style={styles.children}>
                    {Object.entries(node).map(([key, value]) => {
                        if (key === 'parent') return null; // omitimos propiedad parent para evitar recursión infinita

                        // Si es array, iterar cada elemento
                        if (Array.isArray(value)) {
                            return (
                                <View key={key} style={styles.field}>
                                    <Text style={styles.key}>{key}:</Text>
                                    {value.map((item, idx) => (
                                        <ASTNode key={`${key}-${idx}`} node={item} />
                                    ))}
                                </View>
                            );
                        }

                        // Si es objeto, recursión
                        if (typeof value === 'object') {
                            return (
                                <View key={key} style={styles.field}>
                                    <Text style={styles.key}>{key}:</Text>
                                    <ASTNode node={value} />
                                </View>
                            );
                        }

                        // Valor primitivo, mostrar inline
                        return (
                            <Text key={key} style={styles.field}>
                                <Text style={styles.key}>{key}:</Text> {String(value)}
                            </Text>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        paddingVertical: 2,
        borderLeftWidth: 1,
        borderColor: '#ccc',
    },
    title: {
        fontWeight: 'bold',
        color: '#333',
    },
    field: {
        marginLeft: 10,
        marginTop: 2,
    },
    key: {
        fontWeight: '600',
        color: '#555',
    },
    children: {
        marginLeft: 10,
    },
});
