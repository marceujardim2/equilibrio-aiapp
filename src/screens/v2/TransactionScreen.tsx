/**
 * Transaction Screen - Design System V2
 * Tela de detalhes de transação com design moderno
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeV2';
import { Button } from '../../components/v2/Button';
import { Card } from '../../components/v2/Card';

interface TransactionScreenProps {
  transactionId?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TransactionScreen: React.FC<TransactionScreenProps> = ({
  transactionId,
  onBack,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  
  // Mock data
  const transaction = {
    id: transactionId || '1',
    amount: -125.50,
    description: 'Almoço no restaurante',
    category: 'Alimentação',
    date: '15 de Novembro, 2024',
    time: '13:30',
    paymentMethod: 'Cartão de crédito',
    location: 'Restaurante da esquina',
  };

  const isExpense = transaction.amount < 0;
  const amountColor = isExpense ? theme.colors.error : theme.colors.success;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors['text-primary']} />
        </Pressable>
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors['text-primary'],
              fontSize: theme.typography.h3.size,
              fontWeight: theme.typography.h3.weight.toString(),
            },
          ]}
        >
          Detalhes da Transação
        </Text>
        <Pressable onPress={onEdit} style={styles.editButton}>
          <Ionicons name="pencil" size={24} color={theme.colors.primary} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card variant="elevated" padding="lg" style={styles.amountCard}>
            <LinearGradient
              colors={isExpense ? [theme.colors.error + '20', theme.colors.error + '10'] : [theme.colors.success + '20', theme.colors.success + '10']}
              style={styles.amountGradient}
            >
              <View style={styles.amountIconContainer}>
                <Ionicons
                  name={isExpense ? 'arrow-down-circle' : 'arrow-up-circle'}
                  size={48}
                  color={amountColor}
                />
              </View>
              <Text
                style={[
                  styles.amount,
                  {
                    color: amountColor,
                    fontSize: theme.typography.display.size,
                    fontWeight: theme.typography.display.weight.toString(),
                  },
                ]}
              >
                R$ {Math.abs(transaction.amount).toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.amountLabel,
                  {
                    color: theme.colors['text-secondary'],
                    fontSize: theme.typography.body.size,
                  },
                ]}
              >
                {isExpense ? 'Gasto' : 'Receita'}
              </Text>
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* Details */}
        <View style={styles.details}>
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="elevated" padding="lg" style={styles.detailCard}>
              <DetailRow
                icon="receipt-outline"
                label="Descrição"
                value={transaction.description}
                theme={theme}
              />
              <DetailRow
                icon="pricetag-outline"
                label="Categoria"
                value={transaction.category}
                theme={theme}
              />
              <DetailRow
                icon="calendar-outline"
                label="Data"
                value={transaction.date}
                theme={theme}
              />
              <DetailRow
                icon="time-outline"
                label="Hora"
                value={transaction.time}
                theme={theme}
              />
              <DetailRow
                icon="card-outline"
                label="Forma de pagamento"
                value={transaction.paymentMethod}
                theme={theme}
              />
              <DetailRow
                icon="location-outline"
                label="Local"
                value={transaction.location}
                theme={theme}
              />
            </Card>
          </Animated.View>

          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.actions}>
            <Button
              title="Editar"
              onPress={onEdit || (() => {})}
              variant="outline"
              size="large"
              fullWidth
              style={styles.actionButton}
            />
            <Button
              title="Excluir"
              onPress={onDelete || (() => {})}
              variant="destructive"
              size="large"
              fullWidth
            />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: any;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, theme }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailRowLeft}>
      <Ionicons name={icon} size={20} color={theme.colors['text-tertiary']} />
      <Text
        style={[
          styles.detailLabel,
          {
            color: theme.colors['text-secondary'],
            fontSize: theme.typography.small.size,
            marginLeft: theme.spacing.sm,
          },
        ]}
      >
        {label}
      </Text>
    </View>
    <Text
      style={[
        styles.detailValue,
        {
          color: theme.colors['text-primary'],
          fontSize: theme.typography.body.size,
          fontWeight: theme.typography['body-medium'].weight.toString(),
        },
      ]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  amountCard: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  amountGradient: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  amountIconContainer: {
    marginBottom: 16,
  },
  amount: {
    marginBottom: 8,
  },
  amountLabel: {},
  details: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  detailCard: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {},
  detailValue: {
    flex: 1,
    textAlign: 'right',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 12,
  },
});
