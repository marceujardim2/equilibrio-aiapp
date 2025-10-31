import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Badge } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { logout } from '../services/auth';

interface BadgeItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  earned: boolean;
  delay: number;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ icon, title, description, earned, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.badgeItem}>
    <View style={[styles.badgeIcon, { opacity: earned ? 1 : 0.3 }]}>
      <LinearGradient
        colors={earned ? [colors.warning, colors.mood] : [colors.gray300, colors.gray400]}
        style={styles.badgeGradient}
      >
        <Ionicons name={icon} size={28} color={colors.card} />
      </LinearGradient>
    </View>
    <View style={styles.badgeInfo}>
      <Text style={[styles.badgeTitle, { opacity: earned ? 1 : 0.5 }]}>{title}</Text>
      <Text style={[styles.badgeDescription, { opacity: earned ? 1 : 0.5 }]}>{description}</Text>
    </View>
    {earned && <Ionicons name="checkmark-circle" size={24} color={colors.success} />}
  </Animated.View>
);

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  value,
  onPress,
  showSwitch,
  switchValue,
  onSwitchChange,
}) => (
  <Pressable onPress={onPress} style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    {showSwitch ? (
      <Switch value={switchValue} onValueChange={onSwitchChange} />
    ) : (
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
      </View>
    )}
  </Pressable>
);

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header com Avatar */}
        <Animated.View entering={FadeInDown.springify()}>
          <LinearGradient colors={[colors.primary, colors.tertiary]} style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <Badge text="Premium" color={colors.warning} style={styles.premiumBadge} />
            </View>
            <Text style={styles.userName}>João da Silva</Text>
            <Text style={styles.userEmail}>joao@email.com</Text>
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>78</Text>
                <Text style={styles.statLabel}>Score Médio</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statLabel}>Dias Ativos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Conquistas</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Badges/Conquistas */}
        <Text style={styles.sectionTitle}>Conquistas</Text>
        <Card style={styles.badgesCard}>
          <BadgeItem
            icon="flame"
            title="Sequência de 7 dias"
            description="Complete 7 dias seguidos"
            earned={true}
            delay={200}
          />
          <BadgeItem
            icon="fitness"
            title="Atleta"
            description="30 dias de atividade física"
            earned={true}
            delay={250}
          />
          <BadgeItem
            icon="wallet"
            title="Economista"
            description="Fique abaixo do orçamento por 1 mês"
            earned={false}
            delay={300}
          />
          <BadgeItem
            icon="moon"
            title="Dorminhoco"
            description="Durma 8h por 7 dias seguidos"
            earned={false}
            delay={350}
          />
        </Card>

        {/* Configurações */}
        <Text style={styles.sectionTitle}>Configurações</Text>
        <Card style={styles.settingsCard}>
          <SettingItem icon="person" title="Editar Perfil" onPress={() => {}} />
          <SettingItem
            icon="notifications"
            title="Notificações"
            showSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <SettingItem
            icon="moon"
            title="Modo Escuro"
            showSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingItem icon="language" title="Idioma" value="Português" onPress={() => {}} />
          <SettingItem icon="card" title="Assinatura" value="Premium" onPress={() => {}} />
        </Card>

        {/* Outros */}
        <Card style={styles.settingsCard}>
          <SettingItem icon="help-circle" title="Ajuda e Suporte" onPress={() => {}} />
          <SettingItem icon="shield-checkmark" title="Privacidade" onPress={() => {}} />
          <SettingItem icon="document-text" title="Termos de Uso" onPress={() => {}} />
        </Card>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  avatarText: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '700',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
  },
  userName: {
    ...typography.h3,
    color: colors.card,
    marginBottom: spacing.xs / 2,
  },
  userEmail: {
    ...typography.body,
    color: colors.card,
    opacity: 0.9,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    ...shadows.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.gray200,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  badgesCard: {
    marginHorizontal: spacing.lg,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  badgeIcon: {
    marginRight: spacing.md,
  },
  badgeGradient: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  badgeDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  settingsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  settingTitle: {
    ...typography.body,
    color: colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    ...typography.button,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  version: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
