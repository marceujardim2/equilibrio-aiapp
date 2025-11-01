import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dimensões base (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Escala horizontal baseada na largura da tela
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Escala vertical baseada na altura da tela
 */
export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Escala moderada - usa média entre largura e altura
 */
export const scaleModerate = (size: number, factor: number = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Escala de fonte responsiva
 */
export const scaleFontSize = (size: number): number => {
  return scaleModerate(size, 0.3);
};

/**
 * Altura da tela considerando status bar e notch
 */
export const getScreenHeight = (): number => {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  return SCREEN_HEIGHT - statusBarHeight;
};

/**
 * Largura da tela
 */
export const getScreenWidth = (): number => {
  return SCREEN_WIDTH;
};

/**
 * Verifica se é um dispositivo pequeno (< 375px)
 */
export const isSmallDevice = (): boolean => {
  return SCREEN_WIDTH < 375;
};

/**
 * Verifica se é um dispositivo médio (375px - 414px)
 */
export const isMediumDevice = (): boolean => {
  return SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
};

/**
 * Verifica se é um dispositivo grande (>= 414px)
 */
export const isLargeDevice = (): boolean => {
  return SCREEN_WIDTH >= 414;
};

/**
 * Verifica se é um tablet
 */
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

/**
 * Retorna padding horizontal responsivo
 */
export const getHorizontalPadding = (): number => {
  if (isSmallDevice()) return 12;
  if (isMediumDevice()) return 16;
  if (isLargeDevice()) return 20;
  return 24; // Tablet
};

/**
 * Retorna padding vertical responsivo
 */
export const getVerticalPadding = (): number => {
  if (isSmallDevice()) return 8;
  if (isMediumDevice()) return 12;
  if (isLargeDevice()) return 16;
  return 20; // Tablet
};

/**
 * Dimensões responsivas
 */
export const responsive = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  screenHeight: getScreenHeight(),
  scaleWidth,
  scaleHeight,
  scaleModerate,
  scaleFontSize,
  isSmallDevice: isSmallDevice(),
  isMediumDevice: isMediumDevice(),
  isLargeDevice: isLargeDevice(),
  isTablet: isTablet(),
  horizontalPadding: getHorizontalPadding(),
  verticalPadding: getVerticalPadding(),
};

export default responsive;
