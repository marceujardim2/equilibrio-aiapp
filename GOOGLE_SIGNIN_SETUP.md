# Configuração do Google Sign-In - App Equilíbrio

## 🎯 Objetivo
Configurar Google Sign-In para autenticação no Firebase.

---

## 📱 Para Desenvolvimento com Expo Go

### **1. SHA-1 do Expo Go (Use este para desenvolvimento)**

Adicione este certificado no Firebase Console:

```
SHA-1: 90:C3:A6:09:40:C7:8B:6A:B2:2D:8B:32:63:6F:9F:E1:2F:47:A8:9C
```

### **2. Passos no Firebase Console**

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **Authentication** → **Sign-in method**
4. Ative **Google** como provedor
5. Clique em **Configurações do projeto** (ícone de engrenagem)
6. Vá até a seção **Seus apps**
7. Selecione o app Android
8. Role até **Impressões digitais de certificado SHA**
9. Clique em **Adicionar impressão digital**
10. Cole o SHA-1 do Expo Go: `90:C3:A6:09:40:C7:8B:6A:B2:2D:8B:32:63:6F:9F:E1:2F:47:A8:9C`
11. Clique em **Salvar**

### **3. Baixar google-services.json**

1. No Firebase Console, vá em **Configurações do projeto**
2. Na seção **Seus apps**, selecione o app Android
3. Clique em **Baixar google-services.json**
4. Salve o arquivo na raiz do projeto (opcional para Expo Go)

---

## 🏗️ Para Build de Produção (EAS Build)

### **1. Configurar EAS**

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### **2. Obter SHA-1 do Build EAS**

```bash
eas credentials
```

Selecione:
- Android
- Production
- Keystore
- View credentials

Copie o **SHA-1** exibido.

### **3. Adicionar SHA-1 no Firebase**

Repita os passos da seção anterior, mas use o SHA-1 do EAS Build.

---

## 🔧 Configuração no Código

### **1. Instalar dependências**

```bash
npx expo install @react-native-google-signin/google-signin
```

### **2. Adicionar ao .env**

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

**Onde encontrar o Web Client ID:**
1. Firebase Console → Configurações do projeto
2. Seção **Seus apps** → Web app
3. Copie o **Client ID**

### **3. Configurar app.config.ts**

```typescript
export default {
  // ... outras configs
  android: {
    // ... outras configs
    googleServicesFile: "./google-services.json", // opcional
  },
  plugins: [
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: "com.yourcompany.windsurfequilibrio"
      }
    ]
  ]
}
```

### **4. Implementar Google Sign-In**

```typescript
// src/services/auth.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, googleCredential);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}
```

---

## 🧪 Testar no Expo Go

### **Limitações do Expo Go**
- Google Sign-In **NÃO funciona** no Expo Go
- Você precisa fazer um **Development Build** ou **EAS Build**

### **Alternativa para Testar Rápido**

Use **Email/Password** para desenvolvimento no Expo Go:

```typescript
// src/services/auth.ts
import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

export async function signUpWithEmail(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}
```

---

## 📋 Checklist de Configuração

### Firebase Console
- [ ] Projeto Firebase criado
- [ ] Authentication ativado
- [ ] Provedor Google ativado
- [ ] App Android adicionado
- [ ] SHA-1 do Expo Go adicionado
- [ ] google-services.json baixado (opcional)

### Código
- [ ] `.env` com `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- [ ] `@react-native-google-signin/google-signin` instalado
- [ ] `app.config.ts` configurado
- [ ] Serviço de auth implementado

### Testes
- [ ] Email/Password funcionando no Expo Go
- [ ] Google Sign-In funcionando no Development Build

---

## 🚀 Comandos Úteis

### Criar Development Build
```bash
eas build --profile development --platform android
```

### Instalar Development Build no dispositivo
```bash
eas build:run -p android
```

### Verificar credenciais EAS
```bash
eas credentials
```

---

## 🔍 Troubleshooting

### Erro: "Developer Error" no Google Sign-In
- Verifique se o SHA-1 está correto no Firebase
- Confirme que o Web Client ID está correto
- Aguarde 5-10 minutos após adicionar SHA-1 (propagação)

### Erro: "SIGN_IN_FAILED"
- Verifique se o Google Sign-In está ativado no Firebase
- Confirme que o email de suporte está configurado

### Erro: "API not enabled"
- Ative a Google+ API no Google Cloud Console
- Vá em: https://console.cloud.google.com/apis/library

---

## 📚 Recursos

- [Expo Google Sign-In Docs](https://docs.expo.dev/guides/google-authentication/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth/android/google-signin)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

---

## 💡 Recomendação

Para o MVP, comece com **Email/Password** que funciona no Expo Go.
Adicione Google Sign-In depois, quando fizer o primeiro build de produção com EAS.
