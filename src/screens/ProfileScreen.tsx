import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Modal, TextInput, SafeAreaView, Platform, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Badge, Button } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { logout, getCurrentUser } from '../services/auth';
import { auth } from '../services/firebase';
import { requestPermissions, scheduleCheckinReminder, cancelAllNotifications } from '../services/notifications';

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
      
      // Calcular dias ativos (check-ins)
      const historyData = await AsyncStorage.getItem(`checkin_history_${userId}`);
      if (historyData) {
        const history = JSON.parse(historyData);
        setActiveDays(history.length);
        
        // Calcular score médio
        const scores = history.map((c: any) => {
          const sleep = c.sleepHours >= 7 && c.sleepHours <= 9 ? 10 : 5;
          const mood = c.mood * 2;
          const activity = c.physicalActivity ? 10 : 0;
          return Math.round((sleep + mood + activity) / 3 * 10);
        });
        const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        setAvgScore(Math.round(avg));
      }
      
      // Calcular conquistas
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

  const handleEditProfile = () => {
    setEditModalVisible(true);
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
        Alert.alert('Sucesso!', 'Perfil atualizado com sucesso');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleNotificationsChange = async (value: boolean) => {
    setNotifications(value);
    
    if (value) {
      const granted = await requestPermissions();
      if (granted) {
        try {
          await scheduleCheckinReminder();
          Alert.alert('Sucesso!', 'Lembretes ativados:\n• Check-in diário às 20h\n• Meditação às 9h');
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível agendar as notificações');
          setNotifications(false);
        }
      } else {
        Alert.alert('Permissão Negada', 'Ative as notificações nas configurações do dispositivo');
        setNotifications(false);
      }
    } else {
      try {
        await cancelAllNotifications();
        Alert.alert('Lembretes Desativados');
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header com Avatar */}
        <Animated.View entering={FadeInDown.springify()}>
          <LinearGradient colors={[colors.primary, colors.tertiary]} style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <Badge text="Free" color={colors.gray400} style={styles.premiumBadge} />
            </View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{avgScore || '--'}</Text>
                <Text style={styles.statLabel}>Score Médio</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activeDays}</Text>
                <Text style={styles.statLabel}>Dias Ativos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{achievements}</Text>
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
          <SettingItem icon="person" title="Editar Perfil" onPress={handleEditProfile} />
          <SettingItem
            icon="notifications"
            title="Notificações"
            showSwitch
            switchValue={notifications}
            onSwitchChange={handleNotificationsChange}
          />
          <SettingItem
            icon="moon"
            title="Modo Escuro"
            showSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingItem icon="language" title="Idioma" value="Português" onPress={() => {}} />
          <SettingItem icon="card" title="Assinatura" value="Free" onPress={() => {}} />
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

      {/* Modal de Edição de Perfil */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.avatarEditContainer}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarTextLarge}>
                  {newName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={styles.avatarHint}>Avatar gerado automaticamente</Text>
            </View>

            <Text style={styles.inputLabel}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor={colors.gray400}
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={userEmail}
              editable={false}
            />
            <Text style={styles.inputHint}>O e-mail não pode ser alterado</Text>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
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
    marginBottom: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  avatarEditContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarTextLarge: {
    ...typography.h2,
    color: colors.card,
    fontWeight: '700',
  },
  avatarHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  inputLabel: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    ...typography.body,
    color: colors.text,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: spacing.md,
  },
  inputDisabled: {
    backgroundColor: colors.gray100,
    color: colors.textSecondary,
  },
  inputHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
