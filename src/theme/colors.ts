export const colors = {
  // Cores principais - tons pastéis suaves
  primary: '#6B9BD1', // Azul claro
  secondary: '#A8D8B9', // Verde menta
  tertiary: '#C5B4E3', // Lilás
  accent: '#F4C2A6', // Bege rosado
  
  // Cores de categoria
  sleep: '#8BB4E5', // Azul sono
  mood: '#F9C74F', // Amarelo humor
  activity: '#90BE6D', // Verde atividade
  finance: '#F94144', // Vermelho finanças (alerta)
  financePositive: '#43AA8B', // Verde finanças positivo
  
  // Backgrounds
  background: '#FAFBFC',
  backgroundDark: '#1A1D23',
  card: '#FFFFFF',
  cardDark: '#2A2D35',
  
  // Textos
  text: '#2D3748',
  textSecondary: '#718096',
  textDark: '#F7FAFC',
  textSecondaryDark: '#A0AEC0',
  
  // Estados
  success: '#48BB78',
  warning: '#ECC94B',
  error: '#F56565',
  info: '#4299E1',
  
  // Neutros
  gray50: '#F7FAFC',
  gray100: '#EDF2F7',
  gray200: '#E2E8F0',
  gray300: '#CBD5E0',
  gray400: '#A0AEC0',
  gray500: '#718096',
  gray600: '#4A5568',
  gray700: '#2D3748',
  gray800: '#1A202C',
  gray900: '#171923',
  
  // Transparências
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  
  // Gradientes (para uso em LinearGradient)
  gradientPrimary: ['#6B9BD1', '#8BB4E5'],
  gradientSecondary: ['#A8D8B9', '#90BE6D'],
  gradientTertiary: ['#C5B4E3', '#B8A4D8'],
  gradientScore: ['#F9C74F', '#F4A261'],
};

export type ColorScheme = 'light' | 'dark';

export const getThemedColors = (scheme: ColorScheme) => ({
  background: scheme === 'light' ? colors.background : colors.backgroundDark,
  card: scheme === 'light' ? colors.card : colors.cardDark,
  text: scheme === 'light' ? colors.text : colors.textDark,
  textSecondary: scheme === 'light' ? colors.textSecondary : colors.textSecondaryDark,
  border: scheme === 'light' ? colors.gray200 : colors.gray700,
});
