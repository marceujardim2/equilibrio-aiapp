# 🔧 Dark Mode - Troubleshooting

## ✅ CHECKLIST DE VERIFICAÇÃO

### **1. Reiniciar o App Completamente**
```bash
# Parar o servidor
Ctrl + C

# Limpar cache
npx expo start --clear
```

### **2. Verificar se os Arquivos Foram Criados**
- [ ] `src/contexts/ThemeContext.tsx` existe?
- [ ] `src/hooks/useThemedColors.ts` existe?
- [ ] `src/components/ThemeToggleButton.tsx` existe?

### **3. Verificar Imports no App.tsx**
```typescript
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
```

### **4. Verificar se ThemeProvider está envolvendo o app**
```typescript
<ThemeProvider>
  <AppContent />
</ThemeProvider>
```

### **5. Verificar se o botão está aparecendo**
- Abra a tela de Login
- Procure o ícone de lua/sol no canto superior direito
- Se não aparecer, há um problema de renderização

---

## 🐛 PROBLEMAS COMUNS

### **Problema 1: "Cannot find module ThemeContext"**

**Solução:**
```bash
# Reiniciar o servidor
npx expo start --clear
```

### **Problema 2: "useTheme must be used within ThemeProvider"**

**Causa:** ThemeProvider não está envolvendo o componente

**Solução:** Verificar `App.tsx`:
```typescript
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>  {/* ← Deve estar aqui */}
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### **Problema 3: Botão não aparece no Login**

**Verificar:**
1. Import está correto?
```typescript
import { ThemeToggleButton } from '../components';
```

2. Componente está renderizado?
```typescript
<ThemeToggleButton 
  size={24} 
  color={colors.card} 
  style={styles.themeButton} 
/>
```

3. Estilo está definido?
```typescript
themeButton: {
  position: 'absolute',
  top: 50,
  right: spacing.lg,
  zIndex: 10,
},
```

### **Problema 4: Tema não muda ao clicar**

**Verificar no console:**
```typescript
// Adicionar no ThemeToggleButton.tsx
console.log('Tema atual:', theme);
console.log('Alternando tema...');
```

**Verificar AsyncStorage:**
```typescript
// No ThemeContext.tsx
console.log('Tema salvo:', savedMode);
console.log('Tema aplicado:', theme);
```

### **Problema 5: Cores não mudam**

**Causa:** Componentes não estão usando `useThemedColors`

**Solução:** Atualizar componentes:
```typescript
import { useThemedColors } from '../hooks/useThemedColors';

function MeuComponente() {
  const themedColors = useThemedColors();
  
  return (
    <View style={{ backgroundColor: themedColors.background }}>
      <Text style={{ color: themedColors.text }}>Texto</Text>
    </View>
  );
}
```

### **Problema 6: StatusBar não muda**

**Verificar App.tsx:**
```typescript
function AppContent() {
  const { theme } = useTheme();
  
  return (
    <>
      <AuthNavigator />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
```

---

## 🧪 TESTE PASSO A PASSO

### **Teste 1: ThemeContext Funciona?**

Adicione no `LoginScreen.tsx` (temporário):
```typescript
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen() {
  const { theme, toggleTheme } = useTheme();
  
  console.log('Tema atual:', theme); // ← Deve aparecer no console
  
  // ... resto do código
}
```

**Resultado esperado:** Console mostra "light" ou "dark"

### **Teste 2: Toggle Funciona?**

Adicione um botão de teste:
```typescript
<Pressable onPress={() => {
  console.log('Antes:', theme);
  toggleTheme();
  console.log('Depois:', theme);
}}>
  <Text>Teste Toggle</Text>
</Pressable>
```

**Resultado esperado:** Console mostra mudança de tema

### **Teste 3: Cores Mudam?**

```typescript
const themedColors = useThemedColors();
console.log('Background:', themedColors.background);
console.log('Text:', themedColors.text);
```

**Resultado esperado:** 
- Light: background="#FAFBFC", text="#2D3748"
- Dark: background="#1A1D23", text="#F7FAFC"

---

## 🔍 DEBUG AVANÇADO

### **Verificar Estado do Tema:**

Adicione no `ThemeContext.tsx`:
```typescript
useEffect(() => {
  console.log('=== THEME DEBUG ===');
  console.log('Mode:', themeMode);
  console.log('System:', systemColorScheme);
  console.log('Final Theme:', theme);
  console.log('==================');
}, [themeMode, systemColorScheme, theme]);
```

### **Verificar AsyncStorage:**

```typescript
// Ler valor salvo
AsyncStorage.getItem('app_theme_mode').then(value => {
  console.log('Tema salvo no storage:', value);
});

// Limpar (se necessário)
AsyncStorage.removeItem('app_theme_mode');
```

---

## 🚀 SOLUÇÃO RÁPIDA

Se nada funcionar, execute:

```bash
# 1. Parar o servidor
Ctrl + C

# 2. Limpar tudo
rm -rf node_modules
npm install

# 3. Limpar cache do Expo
npx expo start --clear

# 4. Recarregar no dispositivo
Pressione 'r' no terminal
```

---

## 📱 TESTE NO DISPOSITIVO

### **Android:**
1. Abra o app
2. Vá para Login
3. Procure o ícone no canto superior direito
4. Toque para alternar
5. Observe se as cores mudam

### **iOS:**
1. Mesmo processo
2. Se não funcionar, force-quit o app
3. Abra novamente

---

## ✅ VERIFICAÇÃO FINAL

Execute este checklist:

- [ ] `npx expo start --clear` executado
- [ ] App recarregado no dispositivo
- [ ] Botão de tema aparece no Login
- [ ] Clicar no botão alterna o ícone (lua ↔ sol)
- [ ] Cores mudam visualmente
- [ ] Ir para Perfil e testar o switch
- [ ] Fechar e reabrir o app mantém o tema

---

## 💡 DICA IMPORTANTE

O Dark Mode está implementado, mas as **cores dinâmicas** só funcionam em componentes que usam `useThemedColors()`.

**Componentes já atualizados:**
- ✅ Card.tsx
- ✅ ThemeToggleButton.tsx
- ✅ ProfileScreen.tsx (switch)

**Componentes que ainda usam cores estáticas:**
- ⚠️ HomeScreen
- ⚠️ CheckinScreen
- ⚠️ FinanceScreen
- ⚠️ WellnessScreen
- ⚠️ Button.tsx
- ⚠️ Badge.tsx

**Isso significa:** O tema funciona, mas algumas telas ainda não mudam de cor completamente.

Para atualizar, siga o guia em `DARK_MODE_GUIDE.md`!

---

## 📞 AINDA NÃO FUNCIONA?

Me diga especificamente:
1. O botão aparece no Login? (Sim/Não)
2. Ao clicar, o ícone muda? (lua → sol)
3. As cores mudam? (Sim/Não/Parcialmente)
4. Qual erro aparece no console?
5. Qual tela você está testando?

Com essas informações, posso ajudar melhor! 🚀
