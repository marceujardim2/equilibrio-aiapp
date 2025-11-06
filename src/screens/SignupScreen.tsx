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
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { signUpWithEmail, getAuthErrorMessage } from '../services/auth';
import { ThemeToggleButton } from '../components';

interface SignupScreenProps {
  onSignupSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function SignupScreen({ onSignupSuccess, onNavigateToLogin }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      Alert.alert(
        'Bem-vindo! 🎉',
        'Sua conta foi criada com sucesso!',
        [{ text: 'Começar', onPress: onSignupSuccess }]
      );
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
            colors={[colors.secondary, colors.activity]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ThemeToggleButton 
              size={24} 
              color={colors.card} 
              style={styles.themeButton} 
            />
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={80} color={colors.card} />
            </View>
            <Text style={styles.headerTitle}>Criar Conta</Text>
            <Text style={styles.headerSubtitle}>Comece sua jornada de equilíbrio</Text>
          </LinearGradient>
        </Animated.View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor={colors.gray400}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).springify()}>
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

          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
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

          <Animated.View entering={FadeInUp.delay(400).springify()}>
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                placeholderTextColor={colors.gray400}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
          </Animated.View>

          {/* Botão de Cadastro */}
          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <Pressable
              onPress={handleSignup}
              disabled={loading}
              style={({ pressed }) => [
                styles.signupButton,
                pressed && styles.signupButtonPressed,
              ]}
            >
              <LinearGradient
                colors={[colors.secondary, colors.activity]}
                style={styles.signupButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color={colors.card} />
                ) : (
                  <Text style={styles.signupButtonText}>Criar Conta</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Termos */}
          <Animated.View entering={FadeInUp.delay(600).springify()}>
            <Text style={styles.terms}>
              Ao criar uma conta, você concorda com nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </Animated.View>

          {/* Divisor */}
          <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* Botão de Login */}
          <Animated.View entering={FadeInUp.delay(800).springify()}>
            <Pressable
              onPress={onNavigateToLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
            >
              <Text style={styles.loginButtonText}>Já tenho uma conta</Text>
            </Pressable>
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
  themeButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    zIndex: 10,
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
  signupButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.md,
    marginBottom: spacing.md,
  },
  signupButtonPressed: {
    opacity: 0.8,
  },
  signupButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    ...typography.button,
    color: colors.card,
  },
  terms: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
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
  loginButton: {
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.secondary,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  loginButtonPressed: {
    opacity: 0.6,
  },
  loginButtonText: {
    ...typography.button,
    color: colors.secondary,
  },
});
