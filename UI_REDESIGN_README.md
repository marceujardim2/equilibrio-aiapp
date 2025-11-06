# 🎨 UI/UX Redesign - EquilíbrioAI

## Entrega A: Design System & 8 Telas Principais ✅

Este documento descreve o redesign completo da UI/UX do EquilíbrioAI usando um design system moderno e acessível com dark theme completo.

---

## 📋 Índice

1. [Design Tokens](#design-tokens)
2. [Componentes](#componentes)
3. [Telas Implementadas](#telas-implementadas)
4. [Guia de Implementação](#guia-de-implementação)
5. [Acessibilidade](#acessibilidade)
6. [QA Checklist](#qa-checklist)

---

## 🎨 Design Tokens

### Cores (Dark Theme)

```typescript
background: '#0B0F14'        // Fundo principal
surface-1: '#0F1418'         // Superfície nível 1
surface-2: '#12171C'         // Superfície nível 2
card: '#121820'              // Cards padrão
primary: '#7DE3B6'           // Verde menta vibrante
accent: '#60A7FF'            // Azul vibrante
text-primary: '#E6EEF2'      // Texto principal
text-secondary: '#B9C4CC'    // Texto secundário
success: '#5EE3B4'           // Verde sucesso
warning: '#FFD166'           // Amarelo aviso
error: '#FF6B6B'             // Vermelho erro
```

### Tipografia

- **H1**: 28px, Weight 700, Line Height 36
- **H2**: 22px, Weight 600, Line Height 30
- **H3**: 20px, Weight 600, Line Height 28
- **Body**: 16px, Weight 400, Line Height 22
- **Small**: 13px, Weight 400, Line Height 18
- **Display**: 36px, Weight 700 (valores grandes)

### Espaçamentos

- **xs**: 6px
- **sm**: 12px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Border Radius

- **xs**: 4px
- **sm**: 8px
- **md**: 14px (padrão para cards)
- **lg**: 20px
- **xl**: 28px
- **full**: 9999px (círculo completo)

---

## 🧩 Componentes

### Button

Variantes: `primary`, `secondary`, `outline`, `ghost`, `destructive`  
Tamanhos: `small`, `medium`, `large`

```typescript
import { Button } from '@/components/v2';

<Button
  title="Começar agora"
  onPress={handlePress}
  variant="primary"
  size="large"
  fullWidth
  loading={isLoading}
/>
```

### Card

Variantes: `default`, `elevated`, `outlined`, `glass`

```typescript
import { Card } from '@/components/v2';

<Card variant="elevated" padding="lg" onPress={handlePress}>
  <Text>Conteúdo do card</Text>
</Card>
```

### Input

```typescript
import { Input } from '@/components/v2';

<Input
  label="E-mail"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  leftIcon={<Ionicons name="mail-outline" />}
  error={errors.email}
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

## 📱 Telas Implementadas

### 1. Splash Screen

**Arquivo**: `src/screens/v2/SplashScreen.tsx`

- Animação de entrada suave
- Logo com gradiente
- Texto animado com fade-in
- Auto-redirecionamento após 2 segundos

### 2. Onboarding Screen

**Arquivo**: `src/screens/v2/OnboardingScreen.tsx`

- 3 slides com microcopy otimista
- Indicadores de progresso animados
- Botão "Pular" e "Próximo"
- Gradientes por slide

**Microcopy**:
- "Controle seus gastos com clareza" 💰
- "Registre hábitos, evolua diariamente" 💪
- "Conquiste seus objetivos" 🎯

### 3. Login Screen

**Arquivo**: `src/screens/v2/LoginScreen.tsx`

- Formulário com validação
- Toggle de senha (mostrar/ocultar)
- Login social (Google)
- Link para recuperar senha
- Link para cadastro

### 4. Home/Dashboard Screen

**Arquivo**: `src/screens/v2/HomeScreen.tsx`

- Score de equilíbrio circular (SVG animado)
- Grid de métricas (Sono, Humor, Atividade, Gastos)
- Card de orçamento mensal com barra de progresso
- Card de dica do dia
- FAB para ações rápidas

### 5. Check-in Screen

**Arquivo**: `src/screens/v2/CheckinScreen.tsx`

- Slider para horas de sono
- Seleção de humor com emojis
- Contador de copos de água (8 copos)
- Toggle exercício físico (Sim/Não)
- Campo de gasto do dia
- Botão de salvar com loading

### 6. Transaction Screen

**Arquivo**: `src/screens/v2/TransactionScreen.tsx`

- Card de valor destacado com gradiente
- Detalhes completos (descrição, categoria, data, hora, pagamento, local)
- Botões de ação (Editar, Excluir)
- Ícones contextuais

### 7. Profile Screen

**Arquivo**: `src/screens/v2/ProfileScreen.tsx`

- Header com avatar e informações do usuário
- Estatísticas (Dias ativos, Conquistas, Streak)
- Menu de configurações com switches
- Toggle de modo escuro
- Botão de logout

---

## 🚀 Guia de Implementação

### 1. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 2. Usar o Novo Tema

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

### 3. Usar Componentes V2

```typescript
import { Button, Card, Input } from '@/components/v2';
import { useTheme } from '@/hooks/useThemeV2';
```

### 4. Implementar Telas

```typescript
import { HomeScreen } from '@/screens/v2';
```

---

## ♿ Acessibilidade

### Contraste de Cores (WCAG AA)

- ✅ Texto normal: 4.5:1 mínimo
- ✅ Texto grande (18px+): 3:1 mínimo
- ✅ Títulos: AAA quando possível

### Tamanhos de Toque

- ✅ Botões: mínimo 44x44dp
- ✅ Cards clicáveis: área suficiente
- ✅ Inputs: altura mínima 48dp

### Suporte a Leitores de Tela

- ✅ Labels em todos os inputs
- ✅ Roles apropriados
- ✅ Textos descritivos

### Tamanhos de Fonte

- ✅ Mínimo 13px para texto legível
- ✅ Escalável conforme preferências do sistema

---

## ✅ QA Checklist

### Testes Funcionais

- [ ] Splash screen aparece e redireciona corretamente
- [ ] Onboarding navega entre slides
- [ ] Login valida e autentica
- [ ] Home exibe métricas corretas
- [ ] Check-in salva dados corretamente
- [ ] Transação exibe detalhes completos
- [ ] Perfil permite editar configurações

### Testes Visuais

- [ ] Dark theme aplicado corretamente
- [ ] Cores com contraste adequado
- [ ] Tipografia legível
- [ ] Espaçamentos consistentes
- [ ] Animações suaves
- [ ] Estados de loading funcionam

### Testes de Responsividade

- [ ] Tela 360x800 (Android pequeno)
- [ ] Tela 412x915 (Android médio)
- [ ] Tela 768x1024 (Tablet)

### Testes de Acessibilidade

- [ ] VoiceOver/TalkBack funciona
- [ ] Contraste de cores validado
- [ ] Tamanhos de toque adequados
- [ ] Navegação por teclado funciona

### Testes de Performance

- [ ] Animações fluidas (60fps)
- [ ] Carregamento rápido
- [ ] Sem memory leaks
- [ ] Scroll suave

---

## 📦 Estrutura de Arquivos

```
src/
├── components/
│   └── v2/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── FloatingActionButton.tsx
│       └── index.ts
├── screens/
│   └── v2/
│       ├── SplashScreen.tsx
│       ├── OnboardingScreen.tsx
│       ├── LoginScreen.tsx
│       ├── HomeScreen.tsx
│       ├── CheckinScreen.tsx
│       ├── TransactionScreen.tsx
│       ├── ProfileScreen.tsx
│       └── index.ts
├── theme/
│   └── v2/
│       └── theme.ts
└── hooks/
    └── useThemeV2.ts

design-tokens.json
```

---

## 🎯 Próximos Passos (Entrega B)

1. Component Library completa
2. Protótipo navegável no Figma
3. Assets exportados (SVG/PNG 1x/2x/3x)
4. Mais componentes (Modal, BottomTab, Header, etc.)

---

## 📝 Notas Técnicas

- **Framework**: React Native / Expo
- **Animações**: react-native-reanimated
- **Gradientes**: expo-linear-gradient
- **Ícones**: @expo/vector-icons
- **Tipografia**: Inter (fallback: System)

---

## 🔗 Links Úteis

- [Design Tokens JSON](./design-tokens.json)
- [Theme TypeScript](./src/theme/v2/theme.ts)
- [Componentes](./src/components/v2/)
- [Telas](./src/screens/v2/)

---

**Desenvolvido com ❤️ para EquilíbrioAI**
