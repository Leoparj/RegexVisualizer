import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { act } from 'react-test-renderer';
import RegexTester from '../src/features/regexTester/components/organisms/RegexTester';

jest.useFakeTimers();

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  const confirm = buttons?.find(b => b.text === 'Sí' || b.style !== 'cancel');
  confirm?.onPress?.();
});

describe('RegexTester', () => {
  it('debe renderizar sin errores', () => {
    render(<RegexTester />);
  });

  it('actualiza la expresión regular al escribir', () => {
    const { getByPlaceholderText } = render(<RegexTester />);
    const input = getByPlaceholderText('Ej. \\\\d+');
    fireEvent.changeText(input, '\\w+');
    expect(input.props.value).toBe('\\w+');
  });

  it('actualiza el texto de prueba al escribir', () => {
    const { getByPlaceholderText } = render(<RegexTester />);
    const input = getByPlaceholderText('Escribe aquí...');
    fireEvent.changeText(input, '123 abc');
    expect(input.props.value).toBe('123 abc');
  });

  it('guarda una expresión regular', () => {
    const { getByPlaceholderText, getByText } = render(<RegexTester />);
    const regexInput = getByPlaceholderText('Ej. \\\\d+');
    const saveButton = getByText('Guardar Expresión');
    fireEvent.changeText(regexInput, '\\d+');
    fireEvent.press(saveButton);
    expect(getByText('\\d+')).toBeTruthy();
  });

  it('selecciona una expresión guardada', () => {
    const { getByPlaceholderText, getByText } = render(<RegexTester />);
    const regexInput = getByPlaceholderText('Ej. \\\\d+');
    const saveButton = getByText('Guardar Expresión');
    fireEvent.changeText(regexInput, '\\d+');
    fireEvent.press(saveButton);
    fireEvent.press(getByText('\\d+'));
    expect(regexInput.props.value).toBe('\\d+');
  });

  it('resalta coincidencias correctamente', async () => {
    const { getByPlaceholderText, findAllByText } = render(<RegexTester />);
    const regexInput = getByPlaceholderText('Ej. \\\\d+');
    const testInput = getByPlaceholderText('Escribe aquí...');
    fireEvent.changeText(regexInput, '\\d+');
    fireEvent.changeText(testInput, 'abc 123 def 456');
    expect(await findAllByText('123')).toBeTruthy();
    expect(await findAllByText('456')).toBeTruthy();
  });

  it('filtra expresiones sin distinguir mayúsculas', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<RegexTester />);
    const regexInput = getByPlaceholderText('Ej. \\\\d+');
    const saveButton = getByText('Guardar Expresión');
    const searchInput = getByPlaceholderText('Buscar expresión...');

    fireEvent.changeText(regexInput, '\\d+');
    fireEvent.press(saveButton);
    fireEvent.changeText(regexInput, '\\w+');
    fireEvent.press(saveButton);
    fireEvent.changeText(regexInput, '[A-Z]{3}');
    fireEvent.press(saveButton);

    fireEvent.changeText(searchInput, 'w+');

    expect(queryByText('\\w+')).toBeTruthy();
    expect(queryByText('\\d+')).toBeNull();
    expect(queryByText('[A-Z]{3}')).toBeNull();
  });

  it('edita una expresión correctamente', async () => {
    const { getByPlaceholderText, getByText, queryAllByText } = render(<RegexTester />);
    const regexInput = getByPlaceholderText('Ej. \\\\d+');
    const saveButton = getByText('Guardar Expresión');

    fireEvent.changeText(regexInput, '\\d+');
    fireEvent.press(saveButton);
    fireEvent.press(getByText('\\d+'));

    await act(async () => {
      fireEvent.changeText(regexInput, '\\d{2,}');
      fireEvent.press(saveButton);
    });

    expect(regexInput.props.value).toBe('\\d{2,}');
    const all = queryAllByText('\\d+');
    expect(all.length).toBeLessThanOrEqual(1);
  });

  // it('elimina una expresión correctamente', async () => {
  // await act(async () => {
  //    const { getByPlaceholderText, getByText, queryByText } = render(<RegexTester />);
  //   const regexInput = getByPlaceholderText('Ej. \\\\d+');
  //   const saveButton = getByText('Guardar Expresión');

  //   fireEvent.changeText(regexInput, '\\d+');
  //    fireEvent.press(saveButton);

  //   expect(getByText('\\d+')).toBeTruthy();

  //   const deleteButton = getByText('Eliminar');
  //   fireEvent.press(deleteButton);

  // Ejecutamos timers pendientes si Alert usa algún tipo de delay
  //  jest.runAllTimers();

  //  await waitFor(() => {
  // Verificamos que el texto ya no esté en pantalla
  //     const deleted = queryByText('\\d+');
  //    expect(deleted).toBeNull();
  //    });
  // });
  //}, 10000);

});
