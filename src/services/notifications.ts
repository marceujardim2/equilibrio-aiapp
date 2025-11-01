import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissões:', error);
    return false;
  }
};

export const scheduleCheckinReminder = async (): Promise<void> => {
  try {
    // Cancelar notificações anteriores
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Lembrete diário às 20h
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Check-in Diário ✨',
        body: 'Não esqueça de registrar seu dia no Equilíbrio!',
        data: { screen: 'Check-in' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });

    // Lembrete de meditação às 9h
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de Meditar 🧘',
        body: 'Reserve 10 minutos para cuidar da sua mente',
        data: { screen: 'Bem-estar' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });

    console.log('Notificações agendadas com sucesso');
  } catch (error) {
    console.error('Erro ao agendar notificações:', error);
    throw error;
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas as notificações foram canceladas');
  } catch (error) {
    console.error('Erro ao cancelar notificações:', error);
    throw error;
  }
};
