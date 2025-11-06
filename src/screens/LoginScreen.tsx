/**
 * Login Screen - Redesigned with new dark theme
 * Tela de login moderna com novo design system
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../hooks/tokens';
import { useThemedColors } from '../hooks/useThemedColors';
import { Button, Input } from '../components';
import { signInWithEmail, getAuthErrorMessage, resetPassword } from '../services/auth';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToSignup }: LoginScreenProps) {
  const colors = useThemedColors();
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
        'E-mail Enviado! ✅',
        'Verifique sua caixa de entrada para redefinir sua senha.'
      );
    } catch (error: any) {
      Alert.alert('Erro', getAuthErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
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
              colors={[colors.primary, colors.accent]}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.logoContainer}>
                <Ionicons name="heart-circle" size={80} color={colors.background} />
              </View>
              <Text style={[styles.headerTitle, { color: colors.background }]}>EquilíbrioAI</Text>
              <Text style={[styles.headerSubtitle, { color: colors.background }]}>Bem-vindo de volta!</Text>
            </LinearGradient>
          </Animated.View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            <Animated.View entering={FadeInUp.delay(100).springify()}>
              <Input
                label="E-mail"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).springify()}>
              <Input
                label="Senha"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                leftIcon="lock-closed"
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(300).springify()}>
              <Pressable onPress={handleForgotPassword}>
                <Text style={[styles.forgotPassword, { color: colors.primary }]}>Esqueceu a senha?</Text>
              </Pressable>
            </Animated.View>

            {/* Botão de Login */}
            <Animated.View entering={FadeInUp.delay(400).springify()}>
              <Button
                title="Entrar"
                onPress={handleLogin}
                variant="primary"
                size="large"
                loading={loading}
                style={styles.loginButton}
              />
            </Animated.View>

            {/* Divisor */}
            <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>ou</Text>
              <View style={styles.dividerLine} />
            </Animated.View>

            {/* Botão de Cadastro */}
            <Animated.View entering={FadeInUp.delay(600).springify()}>
              <Button
                title="Criar uma conta"
                onPress={onNavigateToSignup}
                variant="outline"
                size="large"
                style={styles.signupButton}
              />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    marginBottom: tokens.spacing.md,
  },
  headerTitle: {
    ...tokens.typography.h1,
    color: tokens.colors.background,
    marginBottom: tokens.spacing.xs,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...tokens.typography.body,
    color: tokens.colors.background,
    opacity: 0.9,
  },
  formContainer: {
    padding: tokens.spacing.xl,
    flex: 1,
  },
  forgotPassword: {
    ...tokens.typography.bodySm,
    color: tokens.colors.primary,
    textAlign: 'right',
    marginBottom: tokens.spacing.lg,
  },
  loginButton: {
    marginBottom: tokens.spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: tokens.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: tokens.colors.divider,
  },
  dividerText: {
    ...tokens.typography.bodySm,
    color: tokens.colors.textSecondary,
    marginHorizontal: tokens.spacing.md,
  },
  signupButton: {
    marginTop: tokens.spacing.sm,
  },
});
