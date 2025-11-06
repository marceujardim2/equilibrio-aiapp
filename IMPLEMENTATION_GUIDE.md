# 🎨 Design System - Implementação Prática

## Como Usar os Componentes

### Button

```typescript
import { Button } from '@/components/v2';
import { useTheme } from '@/hooks/useThemeV2';

// Botão primário
<Button
  title="Começar agora"
  onPress={handlePress}
  variant="primary"
  size="large"
  fullWidth
/>

// Botão outline
<Button
  title="Cancelar"
  onPress={handleCancel}
  variant="outline"
  size="medium"
/>

// Botão com loading
<Button
  title="Salvar"
  onPress={handleSave}
  variant="primary"
  loading={isLoading}
/>

// Botão com ícone
<Button
  title="Entrar"
  onPress={handleLogin}
  variant="primary"
  icon={<Ionicons name="arrow-forward" />}
/>
```

### Card

```typescript
import { Card } from '@/components/v2';

// Card padrão
<Card variant="elevated" padding="lg">
  <Text>Conteúdo</Text>
</Card>

// Card clicável
<Card variant="elevated" padding="md" onPress={handlePress}>
  <Text>Clique aqui</Text>
</Card>

// Card glass
<Card variant="glass" padding="lg">
  <Text>Dica do dia</Text>
</Card>
```

### Input

```typescript
import { Input } from '@/components/v2';
import { Ionicons } from '@expo/vector-icons';

// Input simples
<Input
  label="E-mail"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
/>

// Input com ícones
<Input
  label="Senha"
  placeholder="••••••••"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  leftIcon={<Ionicons name="lock-closed-outline" />}
  rightIcon={<Ionicons name="eye-outline" />}
/>

// Input com erro
<Input
  label="E-mail"
  value={email}
  onChangeText={setEmail}
  error="E-mail inválido"
/>
```

### FloatingActionButton

```typescript
import { FloatingActionButton } from '@/components/v2';

<FloatingActionButton
  onPress={handleAdd}
  icon="add"
  position="bottom-right"
  size="medium"
/>
```

---

## Como Usar o Tema

### Hook useTheme

```typescript
import { useTheme } from '@/hooks/useThemeV2';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors['text-primary'] }}>
        Texto
      </Text>
    </View>
  );
};
```

### Cores

```typescript
// Cores principais
theme.colors.background       // Fundo principal
theme.colors.surface-1        // Superfície nível 1
theme.colors.card             // Cards
theme.colors.primary          // Cor primária
theme.colors.accent           // Cor de destaque
theme.colors['text-primary']  // Texto principal
theme.colors['text-secondary'] // Texto secundário
theme.colors.success          // Sucesso
theme.colors.warning          // Aviso
theme.colors.error            // Erro
```

### Tipografia

```typescript
// Estilos pré-definidos
theme.typography.h1           // { size: 28, weight: 700, lineHeight: 36 }
theme.typography.h2           // { size: 22, weight: 600, lineHeight: 30 }
theme.typography.body         // { size: 16, weight: 400, lineHeight: 22 }
theme.typography.small         // { size: 13, weight: 400, lineHeight: 18 }
theme.typography.display       // { size: 36, weight: 700, lineHeight: 44 }

// Uso
<Text style={{
  fontSize: theme.typography.h1.size,
  fontWeight: theme.typography.h1.weight.toString(),
  lineHeight: theme.typography.h1.lineHeight,
}}>
  Título
</Text>
```

### Espaçamentos

```typescript
theme.spacing.xs    // 6px
theme.spacing.sm    // 12px
theme.spacing.md    // 16px
theme.spacing.lg    // 24px
theme.spacing.xl    // 32px

// Uso
<View style={{ padding: theme.spacing.md }}>
  <Text>Conteúdo</Text>
</View>
```

### Border Radius

```typescript
theme.radii.sm      // 8px
theme.radii.md      // 14px
theme.radii.lg      // 20px
theme.radii.full    // 9999px

// Uso
<View style={{ borderRadius: theme.radii.md }}>
  <Text>Card</Text>
</View>
```

### Sombras

```typescript
theme.shadows.sm    // Sombra pequena
theme.shadows.md    // Sombra média
theme.shadows.lg    // Sombra grande

// Uso
<View style={theme.shadows.md}>
  <Text>Card elevado</Text>
</View>
```

---

## Padrões de Estilo

### Container Principal

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{
  flex: 1,
  backgroundColor: theme.colors.background,
}} edges={['top']}>
  {/* Conteúdo */}
</SafeAreaView>
```

### Header de Tela

```typescript
<View style={{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: theme.spacing.lg,
  paddingTop: theme.spacing.md,
  paddingBottom: theme.spacing.lg,
}}>
  <Text style={{
    color: theme.colors['text-primary'],
    fontSize: theme.typography.h2.size,
    fontWeight: theme.typography.h2.weight.toString(),
  }}>
    Título
  </Text>
</View>
```

### Card de Métrica

```typescript
<Card variant="elevated" padding="md">
  <View style={{ alignItems: 'center' }}>
    <Ionicons name="icon" size={24} color={theme.colors.primary} />
    <Text style={{
      color: theme.colors['text-secondary'],
      fontSize: theme.typography.small.size,
      marginTop: theme.spacing.xs,
    }}>
      Label
    </Text>
    <Text style={{
      color: theme.colors.primary,
      fontSize: theme.typography.h3.size,
      fontWeight: theme.typography.h3.weight.toString(),
      marginTop: theme.spacing.xs,
    }}>
      Valor
    </Text>
  </View>
</Card>
```

---

## Animações

### FadeInDown

```typescript
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.delay(100).springify()}>
  <Text>Conteúdo animado</Text>
</Animated.View>
```

### Scale Animation

```typescript
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.95, { damping: 15 });
};

const handlePressOut = () => {
  scale.value = withSpring(1, { damping: 15 });
};
```

---

## Microcopy

### Onboarding
- "Controle seus gastos com clareza"
- "Registre hábitos, evolua diariamente"
- "Conquiste seus objetivos"

### CTAs
- "Começar agora"
- "Fazer Check-in"
- "Registrar gasto"
- "Salvar"

### Empty States
- "Ainda sem registros — vamos começar?" 👍
- "Nenhuma transação encontrada"

### Mensagens de Sucesso
- "Check-in salvo com sucesso! 🎉"
- "Transação registrada!"

---

## Boas Práticas

1. **Sempre use o hook useTheme** para acessar tokens
2. **Use componentes V2** quando disponíveis
3. **Mantenha consistência** de espaçamentos e cores
4. **Teste acessibilidade** sempre
5. **Animações suaves** - use spring animations
6. **Microcopy otimista** e motivacional
7. **Emojis moderados** - não exagere

---

## Troubleshooting

### Tema não aplica
```typescript
// Certifique-se de importar corretamente
import { useTheme } from '@/hooks/useThemeV2';
const theme = useTheme();
```

### Componente não renderiza
```typescript
// Verifique se está importando da pasta v2
import { Button } from '@/components/v2';
```

### Cores não aparecem
```typescript
// Use notação de colchetes para cores com hífen
theme.colors['text-primary']  // ✅
theme.colors.text-primary     // ❌
```

---

**Última atualização**: 2024