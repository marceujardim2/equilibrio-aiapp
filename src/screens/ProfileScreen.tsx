/**
 * Profile Screen - Redesigned with new dark theme
 * Tela de perfil completa com estatísticas e configurações
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedColors } from '../hooks/useThemedColors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from '../hooks/tokens';
import { Card, Badge, Button, Input } from '../components';
import { logout } from '../services/auth';
import { auth } from '../services/firebase';
import { requestPermissions, scheduleCheckinReminder, cancelAllNotifications } from '../services/notifications';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps & { colors: ReturnType<typeof useThemedColors> }> = ({
  icon,
  title,
  value,
  onPress,
  showSwitch,
  switchValue,
  onSwitchChange,
  colors,
}) => (
  <Pressable onPress={onPress} style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>{title}</Text>
    </View>
    {showSwitch ? (
      <Switch 
        value={switchValue} 
        onValueChange={onSwitchChange}
        trackColor={{ false: colors.surface2, true: colors.primary }}
        thumbColor={switchValue ? colors.background : colors.muted}
      />
    ) : (
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </View>
    )}
  </Pressable>
);

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemedColors();
  const [notifications, setNotifications] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [avgScore, setAvgScore] = useState(0);
  const [activeDays, setActiveDays] = useState(0);
  const [achievements, setAchievements] = useState(0);

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = () => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || 'Usuário');
      setUserEmail(user.email || '');
      setNewName(user.displayName || '');
    }
  };

  const loadStats = async () => {
    try {
      const userId = auth.currentUser?.uid || 'guest';

      const historyData = await AsyncStorage.getItem(`checkin_history_${userId}`);
      if (historyData) {
        const history = JSON.parse(historyData);
        setActiveDays(history.length);

        const scores = history.map((c: any) => {
          const sleep = c.sleepHours >= 7 && c.sleepHours <= 9 ? 10 : 5;
          const mood = c.mood * 2;
          const activity = c.physicalActivity ? 10 : 0;
          return Math.round((sleep + mood + activity) / 3 * 10);
        });
        const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        setAvgScore(Math.round(avg));
      }

      const streakData = await AsyncStorage.getItem(`wellness_streak_${userId}`);
      let count = 0;
      if (streakData) {
        const streak = JSON.parse(streakData);
        if (streak.count >= 7) count++;
        if (streak.count >= 30) count++;
      }
      if (activeDays >= 7) count++;
      if (activeDays >= 30) count++;
      setAchievements(count);
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!newName.trim()) {
      Alert.alert('Atenção', 'Digite um nome válido');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, {
          displayName: newName.trim(),
        });
        setUserName(newName.trim());
        setEditModalVisible(false);
        Alert.alert('Sucesso! ✅', 'Perfil atualizado com sucesso');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    }
  };

  const handleNotificationsChange = async (value: boolean) => {
    setNotifications(value);

    if (value) {
      const granted = await requestPermissions();
      if (granted) {
        try {
          await scheduleCheckinReminder();
          Alert.alert('Sucesso! ✅', 'Lembretes ativados');
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível agendar as notificações');
          setNotifications(false);
        }
      } else {
        Alert.alert('Permissão Negada', 'Ative as notificações nas configurações');
        setNotifications(false);
      }
    } else {
      try {
        await cancelAllNotifications();
      } catch (error) {
        console.error('Erro ao cancelar notificações:', error);
      }
    }
  };

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
        {/* Header com Avatar */}
        <Animated.View entering={FadeInDown.springify()}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: colors.background }]}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </Text>
              </View>
              <Badge text="Free" color={colors.muted} style={styles.premiumBadge} />
            </View>
            <Text style={[styles.userName, { color: colors.background }]}>{userName}</Text>
            <Text style={[styles.userEmail, { color: colors.background }]}>{userEmail}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card variant="elevated" padding="lg" style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{avgScore || '--'}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Score Médio</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{activeDays}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dias Ativos</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{achievements}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Conquistas</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Configurações */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Configurações</Text>
        <Card variant="outlined" padding="none" style={styles.settingsCard}>
          <SettingItem
            colors={colors}
            icon="person"
            title="Editar Perfil"
            onPress={() => setEditModalVisible(true)}
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingItem
            colors={colors}
            icon="notifications"
            title="Notificações"
            showSwitch
            switchValue={notifications}
            onSwitchChange={handleNotificationsChange}
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingItem
            colors={colors}
            icon="moon"
            title="Modo Escuro"
            showSwitch
            switchValue={theme === 'dark'}
            onSwitchChange={toggleTheme}
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingItem colors={colors} icon="language" title="Idioma" value="Português" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingItem colors={colors} icon="card" title="Assinatura" value="Free" onPress={() => {}} />
        </Card>

        {/* Outros */}
        <Card variant="outlined" padding="none" style={styles.settingsCard}>
          <SettingItem colors={colors} icon="help-circle" title="Ajuda e Suporte" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingItem colors={colors} icon="shield-checkmark" title="Privacidade" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingItem colors={colors} icon="document-text" title="Termos de Uso" onPress={() => {}} />
        </Card>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Button
            title="Sair"
            onPress={handleLogout}
            variant="destructive"
            size="large"
            leftIcon={<Ionicons name="log-out" size={20} color={colors.background} />}
            style={styles.logoutButton}
          />
        </Animated.View>

        <Text style={[styles.version, { color: colors.textSecondary }]}>Versão 1.0.0</Text>
      </ScrollView>

      {/* Modal de Edição */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Editar Perfil</Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.avatarEditContainer}>
              <View style={[styles.avatarLarge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.avatarTextLarge, { color: colors.background }]}>
                  {newName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>Avatar gerado automaticamente</Text>
            </View>

            <Input
              label="Nome Completo"
              placeholder="Digite seu nome"
              value={newName}
              onChangeText={setNewName}
              containerStyle={styles.inputContainer}
            />

            <Input
              label="E-mail"
              value={userEmail}
              editable={false}
              containerStyle={styles.inputContainer}
            />
            <Text style={[styles.inputHint, { color: colors.textSecondary }]}>O e-mail não pode ser alterado</Text>

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setEditModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Salvar"
                onPress={handleSaveProfile}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: tokens.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: tokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...tokens.shadows.lg,
  },
  avatarText: {
    ...tokens.typography.h1,
    fontWeight: '700',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
  },
  userName: {
    ...tokens.typography.h3,
    marginBottom: tokens.spacing.xs / 2,
  },
  userEmail: {
    ...tokens.typography.body,
    opacity: 0.9,
  },
  statsCard: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: -tokens.spacing.lg,
    ...tokens.shadows.lg,
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
    ...tokens.typography.h2,
    fontWeight: '700',
  },
  statLabel: {
    ...tokens.typography.caption,
    marginTop: tokens.spacing.xs / 2,
  },
  statDivider: {
    width: 1,
  },
  sectionTitle: {
    ...tokens.typography.h4,
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  settingsCard: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  settingTitle: {
    ...tokens.typography.body,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    ...tokens.typography.bodySm,
    marginRight: tokens.spacing.xs,
  },
  divider: {
    height: 1,
    marginLeft: tokens.spacing.md,
  },
  logoutButton: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.lg,
  },
  version: {
    ...tokens.typography.caption,
    textAlign: 'center',
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    padding: tokens.spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  modalTitle: {
    ...tokens.typography.h3,
  },
  avatarEditContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: tokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  avatarTextLarge: {
    ...tokens.typography.h2,
    fontWeight: '700',
  },
  avatarHint: {
    ...tokens.typography.caption,
  },
  inputContainer: {
    marginBottom: tokens.spacing.md,
  },
  inputHint: {
    ...tokens.typography.caption,
    marginTop: -tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    marginLeft: tokens.spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
