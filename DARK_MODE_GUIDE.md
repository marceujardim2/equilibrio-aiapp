# 🌙 Guia de Implementação do Dark Mode

## ✅ O QUE JÁ FOI IMPLEMENTADO

### **1. ThemeContext** ✅
- **Arquivo**: `src/contexts/ThemeContext.tsx`
- **Funcionalidades**:
  - Gerenciamento global do tema (light/dark/auto)
  - Persistência com AsyncStorage
  - Detecção automática do tema do sistema
  - Hook `useTheme()` para acessar o tema

### **2. Hook de Cores Temáticas** ✅
- **Arquivo**: `src/hooks/useThemedColors.ts`
- **Funcionalidades**:
  - Retorna cores dinâmicas baseadas no tema atual
  - Memoização para performance
  - Suporte completo a todas as cores do app

### **3. Cores Dark Definidas** ✅
- **Arquivo**: `src/theme/colors.ts`
- **Cores adicionadas**:
  - `backgroundDark`: '#1A1D23'
  - `cardDark`: '#2A2D35'
  - `textDark`: '#F7FAFC'
  - `textSecondaryDark`: '#A0AEC0'

### **4. Integração no App** ✅
- **Arquivo**: `App.tsx`
- ThemeProvider envolvendo toda a aplicação
- Persistência automática da preferência

### **5. Botão Funcional** ✅
- **Arquivo**: `src/screens/ProfileScreen.tsx`
- Switch conectado ao ThemeContext
- Alterna entre light e dark

---

## 🎨 COMO USAR O DARK MODE

### **Em qualquer tela:**

```typescript
import { useTheme } from '../contexts/ThemeContext';
import { useThemedColors } from '../hooks/useThemedColors';

export default function MinhaScreen() {
  const { theme } = useTheme();
  const themedColors = useThemedColors();

  // Criar estilos dinâmicos
  const styles = createStyles(themedColors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Seu conteúdo */}
    </SafeAreaView>
  );
}

// Função de estilos dinâmicos
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Muda automaticamente!
  },
  card: {
    backgroundColor: colors.card,
  },
  text: {
    color: colors.text,
  },
  // ... outros estilos
});
```

---

## 📝 PASSO A PASSO PARA APLICAR EM CADA TELA

### **1. Adicionar Imports**
```typescript
import { useTheme } from '../contexts/ThemeContext';
import { useThemedColors } from '../hooks/useThemedColors';
```

### **2. Usar os Hooks**
```typescript
export default function MinhaScreen() {
  const { theme } = useTheme();
  const themedColors = useThemedColors();
  
  // ... resto do código
}
```

### **3. Converter StyleSheet.create**

**ANTES:**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
});
```

**DEPOIS:**
```typescript
const createStyles = (themedColors: any) => StyleSheet.create({
  container: {
    backgroundColor: themedColors.background,
  },
});

// Dentro do componente:
const styles = createStyles(themedColors);
```

### **4. Substituir Cores Estáticas**

Substituir:
- `colors.background` → `themedColors.background`
- `colors.card` → `themedColors.card`
- `colors.text` → `themedColors.text`
- `colors.textSecondary` → `themedColors.textSecondary`
- `colors.gray100` → `themedColors.gray100`
- `colors.gray200` → `themedColors.gray200`
- etc.

**IMPORTANTE**: Cores de categoria (primary, secondary, sleep, mood, etc.) NÃO mudam!

---

## 🎯 TELAS PARA ATUALIZAR

### **Prioridade Alta:**
- [x] ProfileScreen (JÁ IMPLEMENTADO)
- [ ] HomeScreen
- [ ] CheckinScreen
- [ ] FinanceScreen
- [ ] WellnessScreen

### **Prioridade Média:**
- [ ] LoginScreen
- [ ] RegisterScreen
- [ ] OnboardingScreen

### **Componentes:**
- [ ] Card.tsx
- [ ] Button.tsx
- [ ] Badge.tsx

---

## 🔧 EXEMPLO COMPLETO: HomeScreen

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedColors } from '../hooks/useThemedColors';
import { colors, spacing, typography } from '../theme';

export default function HomeScreen() {
  const { theme } = useTheme();
  const themedColors = useThemedColors();
  
  // Estados...
  const [score, setScore] = useState(0);
  
  // Criar estilos dinâmicos
  const styles = createStyles(themedColors);
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Olá!</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>Score: {score}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (themedColors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themedColors.background, // Dinâmico!
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: themedColors.text, // Dinâmico!
  },
  card: {
    backgroundColor: themedColors.card, // Dinâmico!
    padding: spacing.md,
    borderRadius: 12,
  },
  cardText: {
    color: themedColors.text, // Dinâmico!
  },
});
```

---

## 🎨 CORES DISPONÍVEIS

### **Cores que MUDAM com o tema:**
- `background` - Fundo principal
- `card` - Fundo de cards
- `text` - Texto principal
- `textSecondary` - Texto secundário
- `gray50` até `gray900` - Tons de cinza invertidos
- `border` - Bordas

### **Cores que NÃO mudam:**
- `primary`, `secondary`, `tertiary`, `accent`
- `sleep`, `mood`, `activity`, `finance`, `financePositive`
- `success`, `warning`, `error`, `info`
- `gradientPrimary`, `gradientSecondary`, etc.

---

## 🚀 TESTANDO

### **1. Iniciar o app:**
```bash
npx expo start
```

### **2. Ir para Perfil**
- Ativar/desativar o switch "Modo Escuro"
- O tema deve mudar instantaneamente
- A preferência é salva automaticamente

### **3. Fechar e reabrir o app**
- O tema salvo deve ser mantido

---

## 🐛 TROUBLESHOOTING

### **Cores não mudam:**
- Verifique se está usando `themedColors` em vez de `colors`
- Certifique-se de que `createStyles` está sendo chamado dentro do componente

### **Erro "useTheme must be used within ThemeProvider":**
- Verifique se `ThemeProvider` está em `App.tsx`
- Deve envolver toda a aplicação

### **Performance lenta:**
- Use `useMemo` para estilos complexos
- Evite criar estilos em loops

---

## 📊 STATUS ATUAL

✅ **Implementado:**
- ThemeContext
- useThemedColors hook
- Cores dark definidas
- Persistência AsyncStorage
- Botão no ProfileScreen funcionando

🚧 **Pendente:**
- Aplicar em todas as telas
- Atualizar componentes reutilizáveis
- Testar em diferentes dispositivos

---

## 💡 DICAS

1. **Sempre use `themedColors`** para cores que devem mudar
2. **Mantenha `colors`** para cores fixas (primary, secondary, etc.)
3. **Crie estilos dinamicamente** com `createStyles(themedColors)`
4. **Teste ambos os temas** ao desenvolver novas features
5. **Use o modo auto** para respeitar preferência do sistema

---

## 🎯 PRÓXIMOS PASSOS

1. Aplicar em HomeScreen
2. Aplicar em CheckinScreen
3. Aplicar em FinanceScreen
4. Aplicar em WellnessScreen
5. Atualizar componentes (Card, Button, Badge)
6. Adicionar transições suaves
7. Testar em iOS e Android

---

**O Dark Mode está pronto para ser usado! Basta aplicar o padrão acima em cada tela.** 🌙✨
