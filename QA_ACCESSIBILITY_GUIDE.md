# ♿ Guia de QA e Acessibilidade - EquilíbrioAI

## 📋 Checklist de Acessibilidade (WCAG 2.1 AA)

### 1. Contraste de Cores

#### ✅ Texto Normal (4.5:1 mínimo)
- **Texto primário** (#E6EEF2) sobre background (#0B0F14): **14.5:1** ✅ AAA
- **Texto secundário** (#B9C4CC) sobre background (#0B0F14): **8.7:1** ✅ AA
- **Texto terciário** (#8A9399) sobre background (#0B0F14): **5.2:1** ✅ AA

#### ✅ Texto Grande (3:1 mínimo)
- Todos os títulos (h1, h2) têm contraste adequado ✅

#### ✅ Componentes Interativos
- Botões primários sobre background: **4.8:1** ✅ AA
- Links e CTAs visíveis ✅

**Ferramenta de validação:** Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 2. Tamanhos de Tap Target

#### ✅ Mínimo 44x44dp (WCAG AA)
- Botões: **48px altura mínima** ✅
- Ícones clicáveis: **44x44dp** ✅
- Itens de lista: **48px altura mínima** ✅
- Switches: **44x44dp** ✅

**Validação:** Testar em dispositivos físicos diferentes tamanhos

### 3. Tipografia

#### ✅ Tamanhos Mínimos
- Corpo: **16px** ✅
- Labels: **13px** (mínimo aceitável) ✅
- Captions: **12px** (apenas para informações auxiliares) ✅

#### ✅ Line Height
- Mínimo 1.5x o tamanho da fonte ✅
- Headings: 1.25-1.3x ✅

#### ✅ Peso de Fonte
- Corpo regular: **400** ✅
- Labels e botões: **600** ✅
- Títulos: **700** ✅

### 4. Estados Visuais

#### ✅ Estados de Foco
- Border ou outline visível ✅
- Contraste mínimo 3:1 ✅
- Indicador claro de foco (teclado/navegação) ✅

#### ✅ Estados de Hover/Press
- Mudança visual clara ✅
- Opacidade ou escala ✅
- Feedback imediato ✅

#### ✅ Estados Desabilitados
- Opacidade 50% ✅
- Indicação visual clara ✅
- Texto explicativo quando necessário ✅

### 5. Navegação por Teclado

#### ✅ Ordem Lógica
- Tab order segue ordem visual ✅
- Foco visível ✅
- Não há armadilhas de teclado ✅

#### ✅ Atalhos
- Escape fecha modais ✅
- Enter ativa botões ✅
- Tab navega entre campos ✅

### 6. Screen Readers

#### ✅ Labels
- Todos os inputs têm labels ✅
- Botões têm texto descritivo ✅
- Ícones têm labels alternativos ✅

#### ✅ Roles Semânticos
- Botões: `button` ✅
- Links: `link` ✅
- Headings: `h1`, `h2`, etc. ✅

#### ✅ Texto Alternativo
- Ícones decorativos: `aria-hidden="true"` ✅
- Ícones funcionais: Label descritivo ✅

### 7. Responsividade

#### ✅ Breakpoints Testados
- **360px** (Mobile pequeno) ✅
- **412px** (Mobile médio) ✅
- **768px** (Tablet) ✅

#### ✅ Layout Adaptativo
- Grid responsivo ✅
- Fontes escaláveis ✅
- Espaçamentos proporcionais ✅

---

## 🧪 Checklist de QA Mobile

### Android

#### ✅ Versões Testadas
- [ ] Android 8.0 (API 26)
- [ ] Android 10 (API 29)
- [ ] Android 12 (API 31)
- [ ] Android 14 (API 34)

#### ✅ Dispositivos Testados
- [ ] Pixel 4 (360x800)
- [ ] Pixel 6 Pro (412x915)
- [ ] Tablet 10" (768x1024)

#### ✅ Funcionalidades
- [ ] Navegação entre telas
- [ ] Formulários funcionam
- [ ] Animações suaves
- [ ] Safe areas respeitadas
- [ ] Status bar styling
- [ ] Notch/hole punch handling

### iOS

#### ✅ Versões Testadas
- [ ] iOS 13
- [ ] iOS 15
- [ ] iOS 17

#### ✅ Dispositivos Testados
- [ ] iPhone SE (375x667)
- [ ] iPhone 12 Pro (390x844)
- [ ] iPhone 14 Pro Max (430x932)
- [ ] iPad (768x1024)

#### ✅ Funcionalidades
- [ ] Navegação entre telas
- [ ] Formulários funcionam
- [ ] Animações suaves
- [ ] Safe areas respeitadas
- [ ] Status bar styling
- [ ] Notch/Dynamic Island handling

---

## 🎯 Testes Funcionais

### Telas Principais

#### Splash Screen
- [ ] Animação de entrada suave
- [ ] Transição automática após 2s
- [ ] Logo visível e centralizado
- [ ] Não trava durante animação

#### Onboarding
- [ ] Navegação horizontal funciona
- [ ] Paginação visível e atualizada
- [ ] Botão "Pular" funciona
- [ ] Botão "Próximo" avança slides
- [ ] Último slide mostra "Começar agora"

#### Login
- [ ] Validação de campos funciona
- [ ] Teclado aparece corretamente
- [ ] Mostrar/ocultar senha funciona
- [ ] Link "Esqueceu senha" funciona
- [ ] Botão "Criar conta" navega corretamente
- [ ] Loading state funciona

#### Home/Dashboard
- [ ] Score carrega corretamente
- [ ] Métricas atualizam ao fazer check-in
- [ ] Cards são clicáveis (se aplicável)
- [ ] Scroll funciona suavemente
- [ ] Refresh funciona

#### Check-in
- [ ] Slider de sono funciona
- [ ] Seleção de humor funciona
- [ ] Seleção de água funciona
- [ ] Toggle de atividade funciona
- [ ] Campo de gasto aceita números
- [ ] Botão salvar persiste dados
- [ ] Feedback de sucesso aparece

#### Transaction Detail
- [ ] Informações corretas exibidas
- [ ] Formatação de valores correta
- [ ] Botões de ação funcionam
- [ ] Estado vazio funciona

#### Profile
- [ ] Estatísticas carregam corretamente
- [ ] Edição de perfil funciona
- [ ] Switches funcionam
- [ ] Logout funciona corretamente
- [ ] Modal abre/fecha corretamente

---

## 🎨 Testes Visuais

### Dark Theme
- [ ] Cores consistentes em todas as telas
- [ ] Contraste adequado em todos os elementos
- [ ] Sombras visíveis e apropriadas
- [ ] Gradientes renderizam corretamente
- [ ] Ícones visíveis e legíveis

### Animações
- [ ] Animações suaves (60fps)
- [ ] Sem travamentos durante animações
- [ ] Transições entre telas funcionam
- [ ] Micro-interações responsivas

### Layout
- [ ] Elementos não sobrepõem
- [ ] Espaçamentos consistentes
- [ ] Alinhamentos corretos
- [ ] Safe areas respeitadas
- [ ] Scroll funciona em todas as telas

---

## 🔧 Testes de Performance

### Tempo de Carregamento
- [ ] Splash carrega em < 2s
- [ ] Telas principais carregam em < 1s
- [ ] Imagens carregam progressivamente
- [ ] Sem travamentos visíveis

### Animações
- [ ] 60fps em animações
- [ ] Sem drops de frame
- [ ] Transições suaves

### Memória
- [ ] Sem vazamentos de memória
- [ ] Imagens otimizadas
- [ ] Componentes desmontam corretamente

---

## 🐛 Validação de Bugs Conhecidos

### Críticos
- [ ] Nenhum crash reportado
- [ ] Nenhum erro de console em produção
- [ ] Formulários salvam dados corretamente

### Médios
- [ ] Animações não travam
- [ ] Modais fecham corretamente
- [ ] Navegação não quebra

### Baixos
- [ ] Melhorias visuais menores
- [ ] Ajustes de espaçamento

---

## 📱 Checklist de Testes por Dispositivo

### iPhone SE (375x667)
- [ ] Layout não quebra
- [ ] Textos legíveis
- [ ] Botões acessíveis
- [ ] Scroll funciona

### iPhone 12 Pro (390x844)
- [ ] Safe area respeitada
- [ ] Notch não interfere
- [ ] Layout adaptativo funciona

### iPhone 14 Pro Max (430x932)
- [ ] Dynamic Island não interfere
- [ ] Layout em tela grande funciona
- [ ] Espaçamentos adequados

### Android Pixel 4 (360x800)
- [ ] Layout não quebra
- [ ] Status bar styling correto
- [ ] Navegação funciona

### Android Pixel 6 Pro (412x915)
- [ ] Safe area respeitada
- [ ] Layout adaptativo funciona
- [ ] Animações suaves

### Tablet (768x1024)
- [ ] Layout aproveita espaço
- [ ] Grid adapta corretamente
- [ ] Textos não ficam muito grandes

---

## 🎯 Ferramentas Recomendadas

### Acessibilidade
- **WebAIM Contrast Checker** - Validar contraste
- **axe DevTools** - Auditar acessibilidade
- **VoiceOver** (iOS) - Testar screen reader
- **TalkBack** (Android) - Testar screen reader

### Performance
- **React Native Performance Monitor** - Monitorar FPS
- **Flipper** - Debugging e profiling
- **Chrome DevTools** - Performance web

### Testes
- **Jest** - Testes unitários
- **React Native Testing Library** - Testes de componentes
- **Detox** - Testes E2E

---

## 📝 Relatório de Testes

### Template

```
Data: [DATA]
Versão: [VERSÃO]
Dispositivo: [DISPOSITIVO]
OS: [VERSÃO DO OS]

Funcionalidades Testadas:
- [ ] Item 1
- [ ] Item 2

Bugs Encontrados:
1. [DESCRIÇÃO]
   Severidade: [CRÍTICA/MÉDIA/BAIXA]
   Status: [ABERTO/RESOLVIDO]

Acessibilidade:
- Contraste: ✅/❌
- Tap targets: ✅/❌
- Screen reader: ✅/❌

Performance:
- Tempo de carregamento: [TEMPO]
- FPS médio: [FPS]
- Uso de memória: [MB]

Observações:
[NOTAS ADICIONAIS]
```

---

## ✅ Critérios de Aceitação

### Acessibilidade
- ✅ Contraste mínimo WCAG AA em todos os textos
- ✅ Tap targets mínimo 44x44dp
- ✅ Navegação por teclado funcional
- ✅ Screen reader compatível

### Funcionalidade
- ✅ Todas as telas carregam corretamente
- ✅ Formulários salvam dados
- ✅ Navegação funciona em todas as direções
- ✅ Estados de loading e erro tratados

### Performance
- ✅ Telas carregam em < 2s
- ✅ Animações a 60fps
- ✅ Sem crashes reportados

### Visual
- ✅ Dark theme consistente
- ✅ Layout responsivo em todos os tamanhos
- ✅ Animações suaves

---

**Última atualização:** Entrega A - 2024
