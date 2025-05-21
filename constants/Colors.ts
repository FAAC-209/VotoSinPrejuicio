/**
 * Colores del tema de la aplicación Voto Sin Prejuicio
 * Sistema de colores para consistencia visual en modo claro y oscuro
 */

const tintColorLight = '#4A90E2'; // Azul democrático
const tintColorDark = '#3A7BC8'; // Azul democrático oscuro

export const Colors = {
  light: {
    text: '#333333',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#555555',
    tabIconDefault: '#888888',
    tabIconSelected: tintColorLight,
    cardBackground: 'rgba(250, 250, 250, 0.9)',
    cardBorder: '#E0E0E0',
    buttonPrimary: '#4A90E2',
    buttonSecondary: '#E74C3C',
    stepNumber: '#4A90E2',
  },
  dark: {
    text: '#F5F5F5',
    background: '#1A1A1A',
    tint: tintColorDark,
    icon: '#AAAAAA',
    tabIconDefault: '#888888',
    tabIconSelected: tintColorDark,
    cardBackground: 'rgba(30, 30, 30, 0.8)',
    cardBorder: '#333333',
    buttonPrimary: '#3A7BC8',
    buttonSecondary: '#C0392B',
    stepNumber: '#3A7BC8',
  },
};
