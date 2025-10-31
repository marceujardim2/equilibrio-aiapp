# Autenticação - App Equilíbrio

## ✅ Implementado

### **Telas de Autenticação**

#### 1. **Onboarding (3 slides)**
- 🎯 Slide 1: Bem-vindo ao Equilíbrio
- 📊 Slide 2: Acompanhe seu Progresso
- ✨ Slide 3: Conquiste seus Objetivos
- Gradientes coloridos por slide
- Paginação com dots animados
- Botão "Pular" no topo
- Botão "Próximo" / "Começar"
- Salvo no AsyncStorage (mostra apenas uma vez)

#### 2. **Login**
- Header com gradiente azul/lilás
- Ícone de coração
- Campos: Email e Senha
- Botão "Mostrar/Ocultar senha" (ícone de olho)
- Link "Esqueceu a senha?"
- Botão de login com gradiente
- Divisor "ou"
- Botão "Criar uma conta"
- Validação de campos
- Mensagens de erro personalizadas

#### 3. **Cadastro**
- Header com gradiente verde/atividade
- Ícone de estrelas
- Campos: Nome, Email, Senha, Confirmar Senha
- Botão "Mostrar/Ocultar senha"
- Validação de senha (mínimo 6 caracteres)
- Validação de confirmação de senha
- Termos de uso e privacidade
- Botão de cadastro com gradiente
- Divisor "ou"
- Botão "Já tenho uma conta"
- Alert de boas-vindas ao criar conta

---

## 🎨 Design

### **Cores e Gradientes**

**Onboarding:**
- Slide 1: Azul → Lilás (`primary` → `tertiary`)
- Slide 2: Verde menta → Verde atividade (`secondary` → `activity`)
- Slide 3: Amarelo → Laranja (`mood` → `warning`)

**Login:**
- Header: Azul → Lilás (`primary` → `tertiary`)
- Botão: Azul → Lilás

**Cadastro:**
- Header: Verde menta → Verde atividade (`secondary` → `activity`)
- Botão: Verde menta → Verde atividade

### **Animações**
- FadeInDown para headers
- FadeInUp para formulários (delays escalonados)
- Transições suaves entre telas
- Feedback visual ao pressionar botões

### **Ícones**
- Onboarding: `heart`, `stats-chart`, `sparkles`
- Login: `heart-circle`, `mail`, `lock-closed`, `eye`
- Cadastro: `sparkles`, `person`, `mail`, `lock-closed`

---

## 🔐 Serviço de Autenticação

### **Funções Implementadas**

```typescript
// src/services/auth.ts

signUpWithEmail(email, password, displayName)
// Cria conta e atualiza nome do usuário

signInWithEmail(email, password)
// Faz login com email e senha

logout()
// Desloga o usuário

resetPassword(email)
// Envia email de recuperação de senha

getCurrentUser()
// Retorna o usuário atual ou null

getAuthErrorMessage(error)
// Traduz erros do Firebase para português
```

### **Mensagens de Erro Traduzidas**

- `auth/email-already-in-use` → "Este e-mail já está em uso"
- `auth/invalid-email` → "E-mail inválido"
- `auth/weak-password` → "Senha muito fraca. Use no mínimo 6 caracteres"
- `auth/user-not-found` → "Usuário não encontrado"
- `auth/wrong-password` → "Senha incorreta"
- `auth/too-many-requests` → "Muitas tentativas. Tente novamente mais tarde"
- `auth/network-request-failed` → "Erro de conexão. Verifique sua internet"

---

## 🔄 Fluxo de Autenticação

### **AuthNavigator**

```
App.tsx
  └─ AuthNavigator
      ├─ Verifica AsyncStorage (onboarding visto?)
      ├─ Verifica Firebase Auth (usuário logado?)
      │
      ├─ Se não viu onboarding → OnboardingScreen
      ├─ Se não está logado → LoginScreen ou SignupScreen
      └─ Se está logado → RootNavigator (App principal)
```

### **Estados**
- `loading`: Verificando autenticação
- `onboarding`: Mostrando onboarding
- `login`: Tela de login
- `signup`: Tela de cadastro
- `authenticated`: Usuário logado (mostra app)

---

## 📱 Como Testar

### **1. Primeira vez (Onboarding)**
1. Abra o app
2. Veja os 3 slides do onboarding
3. Clique em "Começar" ou "Pular"
4. Será redirecionado para Login

### **2. Criar Conta**
1. Na tela de Login, clique em "Criar uma conta"
2. Preencha: Nome, Email, Senha, Confirmar Senha
3. Clique em "Criar Conta"
4. Veja o alert de boas-vindas
5. Será redirecionado para o app principal

### **3. Fazer Login**
1. Na tela de Login, preencha Email e Senha
2. Clique em "Entrar"
3. Será redirecionado para o app principal

### **4. Logout**
1. No app, vá até a aba "Perfil"
2. Role até o final
3. Clique em "Sair"
4. Confirme no alert
5. Será redirecionado para Login

### **5. Esqueceu a Senha**
1. Na tela de Login, clique em "Esqueceu a senha?"
2. Confirme o envio do email
3. Verifique seu email (implementação futura)

---

## 🔧 Configuração Firebase

### **1. Ativar Email/Password no Firebase Console**

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto: `equilibrio-aiapp`
3. Vá em **Authentication** → **Sign-in method**
4. Clique em **Email/Password**
5. Ative a opção **Email/Password**
6. Salve

### **2. Variáveis de Ambiente (.env)**

Já configurado com suas chaves:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD8rruCKHTBMiA-xYUSSqODRCrr0NVvBhU
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=equilibrio-aiapp.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=equilibrio-aiapp
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=equilibrio-aiapp.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=992408945241
EXPO_PUBLIC_FIREBASE_APP_ID=1:992408945241:web:86b670b21db4cf8c55e748
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Z58FK5LE12
```

---

## 📦 Dependências Adicionadas

```json
{
  "@react-native-async-storage/async-storage": "^2.x",
  "firebase": "^10.x"
}
```

---

## 🎯 Próximos Passos

### **Melhorias de Autenticação**
- [ ] Implementar recuperação de senha (enviar email)
- [ ] Adicionar Google Sign-In (requer EAS Build)
- [ ] Adicionar Apple Sign-In (iOS)
- [ ] Validação de email (enviar link de confirmação)
- [ ] Atualizar perfil (foto, nome)

### **Persistência de Dados**
- [ ] Salvar check-ins no Firestore
- [ ] Salvar transações financeiras
- [ ] Sincronizar dados entre dispositivos
- [ ] Backup automático

### **Segurança**
- [ ] Rate limiting (limitar tentativas de login)
- [ ] Verificação de email obrigatória
- [ ] 2FA (autenticação de dois fatores)
- [ ] Logout automático após inatividade

---

## 🐛 Troubleshooting

### **Erro: "Network request failed"**
- Verifique sua conexão com a internet
- Verifique se o Firebase está configurado corretamente
- Confirme que o `.env` foi copiado e está correto

### **Erro: "Email already in use"**
- Este email já tem uma conta
- Tente fazer login ou use outro email

### **Erro: "Weak password"**
- Use no mínimo 6 caracteres na senha
- Combine letras, números e símbolos

### **Onboarding aparece toda vez**
- Verifique se o AsyncStorage está funcionando
- Limpe os dados do app e teste novamente

### **Não consigo fazer logout**
- Verifique se o botão está conectado à função
- Veja o console para erros do Firebase

---

## 📚 Recursos

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Expo AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- [React Navigation Auth Flow](https://reactnavigation.org/docs/auth-flow)

---

## ✅ Checklist de Implementação

- [x] Criar serviço de autenticação
- [x] Implementar OnboardingScreen
- [x] Implementar LoginScreen
- [x] Implementar SignupScreen
- [x] Criar AuthNavigator
- [x] Integrar com Firebase Auth
- [x] Adicionar logout no ProfileScreen
- [x] Validação de formulários
- [x] Mensagens de erro em português
- [x] Animações e transições
- [x] Persistência de onboarding visto
- [x] Copiar .env com chaves do Firebase
