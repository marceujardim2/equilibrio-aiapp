# Design System - App Equilíbrio

## 🎨 Visão Geral

App mobile minimalista e moderno focado em saúde, bem-estar e finanças com design clean e cores pastéis suaves.

## 📱 Telas Implementadas

### 1. **Home / Dashboard**
**Características:**
- Gráfico circular do Equilíbrio Score (0-100) com animação
- 4 cards interativos (Sono, Humor, Atividade, Finanças)
- Gradiente suave no header
- Card de "Dica do Dia" com ícone de lâmpada
- Animações de entrada escalonadas (FadeInDown)

**Elementos visuais:**
- Score circular SVG com progresso animado
- Cards com ícones coloridos em containers pastéis
- Saudação personalizada com data atual
- Métricas com valores destacados em cores específicas

---

### 2. **Check-in Diário**
**Características:**
- Interface gamificada e intuitiva
- Slider para sono (0-12h)
- 5 emojis para humor (Péssimo → Ótimo)
- Contador de água com 8 copos interativos
- Toggle Sim/Não para atividade física
- Campo de gasto rápido (R$)
- Botão de salvar com feedback visual

**Interações:**
- Sliders com cores temáticas
- Emojis clicáveis com estado ativo
- Ícones de água preenchidos progressivamente
- Alert de confirmação ao salvar

---

### 3. **Bem-estar**
**Características:**
- Card de streak (sequência de dias) com emoji de fogo
- Cards de meditação com gradientes coloridos
- Botões de play para iniciar atividades
- Timer personalizado com opções rápidas (5, 10, 15, 20 min)
- Badge "Em chamas!" para motivação

**Atividades:**
- Respiração Guiada (5 min) - gradiente verde
- Meditação Matinal (10 min) - gradiente amarelo
- Relaxamento Noturno (15 min) - gradiente azul/lilás
- Alongamento Rápido (7 min) - gradiente verde
- Yoga para Iniciantes (20 min) - gradiente lilás

---

### 4. **Finanças**
**Características:**
- Resumo de gastos vs orçamento
- Barra de progresso visual
- Gráfico de pizza (PieChart) por categoria
- Lista detalhada de categorias com ícones
- Card de dica de economia
- Botão "Adicionar Transação"

**Categorias:**
- Alimentação (vermelho) - 40%
- Transporte (amarelo) - 22%
- Lazer (lilás) - 17%
- Outros (cinza) - 21%

---

### 5. **Perfil**
**Características:**
- Header com gradiente e avatar circular
- Badge "Premium" destacado
- Cards de estatísticas (Score Médio, Dias Ativos, Conquistas)
- Sistema de badges/conquistas (ganhas e bloqueadas)
- Configurações com switches e navegação
- Botão de logout em vermelho

**Conquistas:**
- Sequência de 7 dias (ganho)
- Atleta - 30 dias de atividade (ganho)
- Economista - abaixo do orçamento (bloqueado)
- Dorminhoco - 8h por 7 dias (bloqueado)

---

## 🎨 Paleta de Cores

### Cores Principais (Pastéis)
```
Primary (Azul claro):    #6B9BD1
Secondary (Verde menta): #A8D8B9
Tertiary (Lilás):        #C5B4E3
Accent (Bege rosado):    #F4C2A6
```

### Cores de Categoria
```
Sono:                    #8BB4E5
Humor:                   #F9C74F
Atividade:               #90BE6D
Finanças (alerta):       #F94144
Finanças (positivo):     #43AA8B
```

### Backgrounds
```
Light:                   #FAFBFC
Dark:                    #1A1D23
Card Light:              #FFFFFF
Card Dark:               #2A2D35
```

### Estados
```
Success:                 #48BB78
Warning:                 #ECC94B
Error:                   #F56565
Info:                    #4299E1
```

---

## 📐 Tipografia

### Tamanhos
- **h1**: 36px (Score, títulos principais)
- **h2**: 30px (Saudações, títulos de seção)
- **h3**: 24px (Subtítulos, valores)
- **h4**: 20px (Títulos de card)
- **body**: 16px (Texto padrão)
- **bodySmall**: 14px (Descrições)
- **caption**: 12px (Labels, legendas)

### Pesos
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## 🔲 Espaçamentos

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

## 🎭 Componentes Reutilizáveis

### Card
- Bordas arredondadas (16px)
- Sombra suave
- Padding padrão (16px)
- Animação de escala ao pressionar (0.97)

### Button
- 3 variantes: primary, secondary, outline
- 3 tamanhos: small, medium, large
- Animação de escala ao pressionar (0.95)
- Sombra suave

### Badge
- Bordas totalmente arredondadas
- Padding horizontal (8px)
- Texto pequeno e bold
- Cores customizáveis

---

## ✨ Animações

### Entrada de Telas
- **FadeInDown**: Cards e seções (springify)
- **FadeInLeft**: Itens de lista
- **FadeInUp**: Botões de ação
- **ZoomIn**: Elementos de destaque

### Delays Escalonados
- Primeira seção: 0ms
- Cards seguintes: +100ms cada
- Cria efeito cascata suave

### Microinterações
- Pressable com escala (0.95-0.97)
- Transições suaves com spring
- Feedback visual imediato

---

## 🌓 Modo Claro/Escuro

### Suporte Preparado
- Função `getThemedColors(scheme)` no theme
- Switch no perfil para alternar
- Cores definidas para ambos os modos

### Implementação Futura
- Context API para tema global
- Persistência com AsyncStorage
- Transição animada entre modos

---

## 📊 Gráficos e Visualizações

### Score Circular (SVG)
- Círculo de progresso animado
- Valor centralizado grande
- Label "Equilíbrio" abaixo

### PieChart (Finanças)
- Biblioteca: react-native-chart-kit
- Cores por categoria
- Valores absolutos exibidos
- Legendas coloridas

### Barra de Progresso
- Altura: 8px
- Bordas arredondadas
- Preenchimento colorido por porcentagem

---

## 🎯 Boas Práticas Implementadas

### UX
- ✅ Feedback visual imediato
- ✅ Animações sutis e não intrusivas
- ✅ Hierarquia visual clara
- ✅ Espaçamento consistente
- ✅ Cores intuitivas por categoria
- ✅ Ícones significativos

### Performance
- ✅ Componentes otimizados
- ✅ Animações com Reanimated (thread nativo)
- ✅ ScrollView com showsVerticalScrollIndicator={false}
- ✅ Lazy rendering quando necessário

### Acessibilidade
- ✅ Contraste adequado de cores
- ✅ Tamanhos de toque adequados (min 44px)
- ✅ Textos legíveis
- ✅ Feedback tátil em interações

---

## 🚀 Como Testar

1. **Iniciar o servidor Expo:**
```bash
npx expo start
```

2. **Abrir no dispositivo:**
- Escaneie o QR code com Expo Go (Android)
- Escaneie com a Câmera (iOS)
- Pressione `w` para web
- Pressione `a` para Android emulator

3. **Navegar pelas abas:**
- Home: visualize o score e métricas
- Check-in: interaja com sliders e emojis
- Bem-estar: explore meditações e timer
- Finanças: veja gráficos e categorias
- Perfil: confira badges e configurações

---

## 📦 Dependências Principais

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "react-native-reanimated": "~3.x",
  "react-native-svg": "~15.x",
  "expo-linear-gradient": "~13.x",
  "@react-native-community/slider": "^4.x",
  "react-native-chart-kit": "^6.x",
  "@expo/vector-icons": "^14.x"
}
```

---

## 🎨 Inspirações de Design

- **Material You** (Google): cores dinâmicas e adaptativas
- **iOS Design System**: tipografia e espaçamentos
- **Calm App**: cores suaves e animações relaxantes
- **Nubank**: cards minimalistas e gradientes sutis

---

## 📝 Próximos Passos (Futuro)

- [ ] Implementar tema escuro completo
- [ ] Adicionar haptic feedback
- [ ] Criar onboarding animado
- [ ] Implementar gráficos de linha para histórico
- [ ] Adicionar skeleton loaders
- [ ] Criar animações de transição entre telas
- [ ] Implementar pull-to-refresh
- [ ] Adicionar empty states ilustrados
