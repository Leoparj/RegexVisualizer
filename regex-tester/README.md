# Regex Visualizer / Regex Tester

¡Bienvenido a **Regex Visualizer**! Esta aplicación te permite escribir y probar expresiones regulares en tiempo real, visualizar su AST (Árbol de Sintaxis Abstracta) y explorar diagramas de ferrocarril o árboles sintácticos para entender mejor cómo funciona cada patrón.

---

## 📌 Características

- **Editor en vivo**: escribe tu expresión y texto de prueba, y ve las coincidencias resaltadas al instante.  
- **AST interactivo**: explora la estructura interna de tu patrón en forma de árbol JSON o diagrama sintáctico.  
- **Diagrama de ferrocarril**: representa gráficamente el flujo de tu expresión regular, con zoom y tooltip.  
- **Historial automático**: guarda automáticamente las expresiones que usas, con opción de limpiar y marcar favoritos.  
- **Gestión de guardadas**: guarda, edita, elimina, exporta/importa y comparte tus expresiones favoritas.  
- **Ejemplos precargados**: accede con un clic a 10 patrones comunes (correo, URL, teléfono, fecha, IPv4, color hex, contraseña fuerte, dígitos, palabra completa, etiqueta HTML).  
- **Temas claro/oscuro**: la interfaz se adapta a tu esquema de color.  
- **Arquitectura profesional**: CLEAN + MVVM + Feature First + Atomic Design.

---

## 📂 Estructura del proyecto

```
REGEX-TESTER/
├── mocks/ # mocks para tests
├── tests/ # tests unitarios
├── .expo/ # configuración de Expo
├── .vscode/ # ajustes de VSCode
├── app/ # rutas y pantallas (expo-router)
├── assets/ # recursos estáticos (imágenes, fuentes…)
├── components/ # componentes UI globales reutilizables
├── constants/ # definiciones globales (colores, rutas…)
├── hooks/ # custom hooks de uso general
├── scripts/ # scripts de automatización / utilidades
├── src/ # código fuente principal
│ ├── features/
│ │ └── regexTester/
│ │ ├── components/ # UI atómico: atoms, molecules, organisms
│ │ │ ├── atoms/
│ │ │ ├── molecules/
│ │ │ └── organisms/
│ │ ├── services/ # parseo de RegEx + almacenamiento
│ │ ├── types/ # tipos TS específicos del feature
│ │ └── viewModels/ # lógica MVVM
│ └── utils/ # utilidades genéricas (safeStringify, etc.)
├── node_modules/ # dependencias instaladas
├── README.md # este archivo
├── package.json # definición de scripts y dependencias
├── yarn.lock / package-lock.json # bloqueo de versiones
├── tsconfig.json # configuración de TypeScript
└── babel.config.js # configuración de Babel
```

---

## ⚙️ Instalación y arranque

1. **Clona el repositorio**  
   ```bash
   git clone https://github.com/Leoparj/RegexVisualizer.git
   cd RegexVisualizer/regex-tester
   ```

2. **Instala dependencias**  
   ```bash
   npm install
   # o con Yarn
   # yarn install
   ```

3. **Inicia la app**  
   ```bash
   npm start
   # o npx expo start
   ```

4. **Selecciona plataforma**  
   - **Web**: abre `http://localhost:8081` en tu navegador.  
   - **iOS / Android**: escanea el código QR con Expo Go.

---

## 🚀 Uso

1. Escribe tu **Expresión Regular** en el primer campo.  
2. Ingresa el **Texto de prueba** en el segundo campo; verás las coincidencias resaltadas.  
3. Cambia de pestaña en el visor de AST para ver JSON, Árbol sintáctico o Diagrama de ferrocarril.  
4. Explora el **Historial** y marca favoritos con la ⭐.  
5. Usa los botones para **Guardar**, **Exportar** o **Importar** tus patrones.  
6. Prueba los ejemplos precargados desde la sección **Ejemplos**.

---

## ✏️ Ejemplos de expresiones regulares

1. **Correo electrónico básico**  
   ```regex
   [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
   ```
2. **URL (http/https)**  
   ```regex
   https?:\/\/(?:www\.)?[^\s\/$.?#].[^\s]*$
   ```
3. **Número de teléfono internacional**  
   ```regex
   \+[1-9]\d{1,14}$
   ```
4. **Fecha DD/MM/AAAA**  
   ```regex
   (0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$
   ```
5. **IPv4**  
   ```regex
   ((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$
   ```
6. **Color hexadecimal**  
   ```regex
   #(?:[0-9A-Fa-f]{3}){1,2}$
   ```
7. **Contraseña fuerte (≥8 caracteres)**  
   ```regex
   (?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$
   ```
8. **Solo dígitos**  
   ```regex
   \d+$
   ```
9. **Palabra completa**  
   ```regex
   \bpalabra\b
   ```
10. **Etiqueta HTML simple**  
    ```regex
    ^<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>$
    ```

---

## 📐 Arquitectura

- **CLEAN**: separación clara entre capas de UI, dominio y datos.  
- **MVVM**: lógica en _ViewModels_ (hooks personalizados) con React Hooks o Zustand Store.  
- **Feature First**: cada característica (regexTester) en su propio módulo.  
- **Atomic Design**:  
  - **Atoms**: botones, inputs, labels.  
  - **Molecules**: listas, componentes combinados.  
  - **Organisms**: pantallas completas.

---

