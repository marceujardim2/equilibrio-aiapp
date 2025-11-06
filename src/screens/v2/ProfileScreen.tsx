/**
 * Profile Screen - Design System V2
 * Tela de perfil com configurações e informações do usuário
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeV2';
import { useTheme as useThemeContext } from '../../contexts/ThemeContext';
import { Card } from '../../components/v2/Card';
import { Button } from '../../components/v2/Button';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { theme: themeMode, toggleTheme } = useThemeContext();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);

  const userName = 'João Silva';
  const userEmail = 'joao@email.com';

  const menuItems = [
    {
      icon: 'wallet-outline' as const,
      label: 'Carteira',
      onPress: () => {},
      showArrow: true,
    },
    {
      icon: 'bar-chart-outline' as const,
      label: 'Relatórios',
      onPress: () => {},
      showArrow: true,
    },
    {
      icon: 'notifications-outline' as const,
      label: 'Notificações',
      onPress: () => {},
      showArrow: true,
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors['text-primary']}
        />
      ),
    },
    {
      icon: 'shield-checkmark-outline' as const,
      label: 'Biometria',
      onPress: () => {},
      showArrow: true,
      rightComponent: (
        <Switch
          value={biometricEnabled}
          onValueChange={setBiometricEnabled}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors['text-primary']}
        />
      ),
    },
    {
      icon: 'help-circle-outline' as const,
      label: 'Ajuda e FAQ',
      onPress: () => {},
      showArrow: true,
    },
    {
      icon: 'document-text-outline' as const,
      label: 'Termos de Uso',
      onPress: () => {},
      showArrow: true,
    },
    {
      icon: 'moon-outline' as const,
      label: 'Modo Escuro',
      onPress: () => {},
      showArrow: true,
      rightComponent: (
        <Switch
          value={themeMode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors['text-primary']}
        />
      ),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card variant="elevated" padding="lg" style={styles.headerCard}>
            <LinearGradient
              colors={theme.colors['gradient-primary']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.colors['text-primary'] + '30' }]}>
                  <Text style={[styles.avatarText, { color: theme.colors['text-primary'], fontSize: 32 }]}>
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.userName,
                  {
                    color: theme.colors['text-primary'],
                    fontSize: theme.typography.h2.size,
                    fontWeight: theme.typography.h2.weight.toString(),
                    marginTop: theme.spacing.md,
                  },
                ]}
              >
                {userName}
              </Text>
              <Text
                style={[
                  styles.userEmail,
                  {
                    color: theme.colors['text-secondary'],
                    fontSize: theme.typography.body.size,
                    marginTop: theme.spacing.xs,
                  },
                ]}
              >
                {userEmail}
              </Text>
              <Pressable style={styles.editProfileButton}>
                <Text
                  style={[
                    styles.editProfileText,
                    {
                      color: theme.colors['text-primary'],
                      fontSize: theme.typography.body.size,
                      fontWeight: theme.typography['body-medium'].weight.toString(),
                      marginTop: theme.spacing.md,
                    },
                  ]}
                >
                  Editar Perfil
                </Text>
              </Pressable>
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  {
                    color: theme.colors.primary,
                    fontSize: theme.typography.h2.size,
                    fontWeight: theme.typography.h2.weight.toString(),
                  },
                ]}
              >
                28
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: theme.colors['text-secondary'],
                    fontSize: theme.typography.small.size,
                  },
                ]}
              >
                Dias ativos
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  {
                    color: theme.colors.warning,
                    fontSize: theme.typography.h2.size,
                    fontWeight: theme.typography.h2.weight.toString(),
                  },
                ]}
              >
                12
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: theme.colors['text-secondary'],
                    fontSize: theme.typography.small.size,
                  },
                ]}
              >
                Conquistas
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  {
                    color: theme.colors.success,
                    fontSize: theme.typography.h2.size,
                    fontWeight: theme.typography.h2.weight.toString(),
                  },
                ]}
              >
                7
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: theme.colors['text-secondary'],
                    fontSize: theme.typography.small.size,
                  },
                ]}
              >
                Streak atual
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.menu}>
          <Card variant="elevated" padding="none" style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={item.onPress}
                style={[
                  styles.menuItem,
                  index !== menuItems.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                  },
                ]}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={24} color={theme.colors['text-primary']} />
                  <Text
                    style={[
                      styles.menuItemLabel,
                      {
                        color: theme.colors['text-primary'],
                        fontSize: theme.typography.body.size,
                        marginLeft: theme.spacing.md,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.rightComponent || (item.showArrow && (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors['text-tertiary']} />
                  ))}
                </View>
              </Pressable>
            ))}
          </Card>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.logoutContainer}>
          <Button
            title="Sair"
            onPress={() => {}}
            variant="destructive"
            size="large"
            fullWidth
            icon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.colors['text-primary']}
                style={{ marginRight: theme.spacing.xs }}
              />
            }
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  headerGradient: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '700',
  },
  userName: {},
  userEmail: {},
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  editProfileText: {},
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 24,
    backgroundColor: 'transparent',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {},
  statLabel: {
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  menu: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  menuCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemLabel: {},
  menuItemRight: {
    marginLeft: 16,
  },
  logoutContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
});
