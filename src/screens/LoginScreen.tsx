import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { signInWithEmail, getAuthErrorMessage, resetPassword } from '../services/auth';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert('Erro ao entrar', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Digite seu e-mail para recuperar a senha');
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        'E-mail Enviado!',
        'Verifique sua caixa de entrada para redefinir sua senha.'
      );
    } catch (error: any) {
      Alert.alert('Erro', getAuthErrorMessage(error));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header com Gradiente */}
        <Animated.View entering={FadeInDown.springify()}>
          <LinearGradient
            colors={[colors.primary, colors.tertiary]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="heart-circle" size={80} color={colors.card} />
            </View>
            <Text style={styles.headerTitle}>Equilíbrio</Text>
            <Text style={styles.headerSubtitle}>Bem-vindo de volta!</Text>
          </LinearGradient>
        </Animated.View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={colors.gray400}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.gray400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.gray400}
                />
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <Pressable onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
            </Pressable>
          </Animated.View>

          {/* Botão de Login */}
          <Animated.View entering={FadeInUp.delay(400).springify()}>
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.tertiary]}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color={colors.card} />
                ) : (
                  <Text style={styles.loginButtonText}>Entrar</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divisor */}
          <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* Botão de Cadastro */}
          <Animated.View entering={FadeInUp.delay(600).springify()}>
            <Pressable
              onPress={onNavigateToSignup}
              style={({ pressed }) => [
                styles.signupButton,
                pressed && styles.signupButtonPressed,
              ]}
            >
              <Text style={styles.signupButtonText}>Criar uma conta</Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.card,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.card,
    opacity: 0.9,
  },
  formContainer: {
    padding: spacing.xl,
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  forgotPassword: {
    ...typography.bodySmall,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  loginButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    ...typography.button,
    color: colors.card,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  signupButton: {
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  signupButtonPressed: {
    opacity: 0.6,
  },
  signupButtonText: {
    ...typography.button,
    color: colors.primary,
  },
});
