import React from 'react';
import { ScrollView } from 'react-native';
import ASTNode from './ASTNode';

export default function ASTViewer({ ast }: { ast: any }) {
  return (
    <ScrollView style={{ maxHeight: 300 }}>
      <ASTNode node={ast} />
    </ScrollView>
  );
}
