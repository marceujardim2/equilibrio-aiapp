/**
 * Login Screen - Design System V2
 * Tela de login moderna e acessível
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeV2';
import { Button } from '../../components/v2/Button';
import { Input } from '../../components/v2/Input';
import { Card } from '../../components/v2/Card';

interface LoginScreenProps {
  onLogin: () => void;
  onSignup: () => void;
  onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onSignup,
  onForgotPassword,
}) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simular login
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="heart" size={40} color={theme.colors['text-primary']} />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors['text-primary'],
                fontSize: theme.typography.h1.size,
                fontWeight: theme.typography.h1.weight.toString(),
              },
            ]}
          >
            Bem-vindo de volta!
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors['text-secondary'],
                fontSize: theme.typography.body.size,
              },
            ]}
          >
            Entre para continuar sua jornada de equilíbrio
          </Text>
        </View>

        <Card variant="elevated" padding="lg" style={styles.formCard}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={
              <Ionicons name="mail-outline" size={20} color={theme.colors['text-tertiary']} />
            }
            containerStyle={styles.input}
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors['text-tertiary']} />
            }
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={theme.colors['text-tertiary']}
                />
              </Pressable>
            }
            containerStyle={styles.input}
          />

          <Pressable onPress={onForgotPassword} style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
              Esqueceu a senha?
            </Text>
          </Pressable>

          <Button
            title="Entrar"
            onPress={handleLogin}
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            style={styles.loginButton}
          />
        </Card>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors['text-tertiary'] }]}>ou</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <Button
          title="Continuar com Google"
          onPress={() => {}}
          variant="outline"
          size="large"
          fullWidth
          icon={
            <Ionicons
              name="logo-google"
              size={20}
              color={theme.colors.primary}
              style={{ marginRight: theme.spacing.xs }}
            />
          }
          style={styles.socialButton}
        />

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: theme.colors['text-secondary'] }]}>
            Ainda não tem conta?{' '}
          </Text>
          <Pressable onPress={onSignup}>
            <Text style={[styles.signupLink, { color: theme.colors.primary }]}>
              Cadastre-se
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
  },
  socialButton: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
