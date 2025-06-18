// __tests__/RegexTester.test.tsx
import { render } from '@testing-library/react-native';
import React from 'react';
import RegexTester from '../src/features/regexTester/components/organisms/RegexTester';

describe('RegexTester', () => {
  it('debe renderizar sin errores', () => {
    const { getByText } = render(<RegexTester />);
    expect(getByText('Guardar Expresión')).toBeTruthy();
  });
});
