import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Badge, Button } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { auth } from '../services/firebase';

const screenWidth = Dimensions.get('window').width;

interface CategoryItemProps {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  delay: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, amount, percentage, color, icon, delay }) => (
  <Animated.View entering={FadeInLeft.delay(delay).springify()} style={styles.categoryItem}>
    <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.categoryInfo}>
      <Text style={styles.categoryName}>{name}</Text>
      <Text style={styles.categoryPercentage}>{percentage}%</Text>
    </View>
    <Text style={styles.categoryAmount}>R$ {amount.toFixed(2)}</Text>
  </Animated.View>
);

const CATEGORIES = [
  { id: 'food', name: 'Alimentação', icon: 'restaurant', color: colors.finance },
  { id: 'transport', name: 'Transporte', icon: 'car', color: colors.warning },
  { id: 'leisure', name: 'Lazer', icon: 'game-controller', color: colors.tertiary },
  { id: 'health', name: 'Saúde', icon: 'fitness', color: colors.activity },
  { id: 'others', name: 'Outros', icon: 'ellipsis-horizontal', color: colors.gray400 },
];

export default function FinanceScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [budget] = useState(2000);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const userId = auth.currentUser?.uid || 'guest';
      const key = `transactions_${userId}`;
      const data = await AsyncStorage.getItem(key);
      
      if (data) {
        setTransactions(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const handleAddTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido');
      return;
    }

    try {
      const userId = auth.currentUser?.uid || 'guest';
      const newTransaction = {
        id: Date.now().toString(),
        userId,
        type: transactionType,
        amount: parseFloat(amount),
        category: selectedCategory,
        description: description || 'Sem descrição',
        date: new Date().toISOString().split('T')[0],
        createdAt: Date.now(),
      };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);

      await AsyncStorage.setItem(
        `transactions_${userId}`,
        JSON.stringify(updatedTransactions)
      );

      setModalVisible(false);
      setAmount('');
      setDescription('');
      setSelectedCategory('food');
      
      Alert.alert('Sucesso!', 'Transação adicionada com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a transação');
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const calculateTotals = () => {
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    return { expenses, income, remaining: budget - expenses };
  };

  const getCategoryData = () => {
    const categoryTotals: any = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categoryTotals[t.category]) {
          categoryTotals[t.category] = 0;
        }
        categoryTotals[t.category] += t.amount;
      });

    return CATEGORIES.map(cat => ({
      name: cat.name,
      amount: categoryTotals[cat.id] || 0,
      color: cat.color,
      icon: cat.icon,
    })).filter(cat => cat.amount > 0);
  };

  const { expenses, income, remaining } = calculateTotals();
  const categoryData = getCategoryData();
  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.amount, 0);

  const chartData = categoryData.map(cat => ({
    name: cat.name,
    amount: cat.amount,
    color: cat.color,
    legendFontColor: colors.text,
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.springify()}>
          <Text style={styles.title}>Finanças</Text>
          <Text style={styles.subtitle}>Controle seus gastos</Text>
        </Animated.View>

        {/* Resumo */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Gasto</Text>
                <Text style={[styles.summaryValue, { color: colors.finance }]}>
                  R$ {expenses.toFixed(2)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Restante</Text>
                <Text style={[styles.summaryValue, { color: colors.financePositive }]}>
                  R$ {remaining.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(expenses / budget) * 100}%`, backgroundColor: colors.finance },
                ]}
              />
            </View>
            <Text style={styles.budgetText}>
              {((expenses / budget) * 100).toFixed(0)}% do orçamento (R$ {budget})
            </Text>
          </Card>
        </Animated.View>

        {/* Gráfico */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Gastos por Categoria</Text>
            <PieChart
              data={chartData}
              width={screenWidth - spacing.lg * 4}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          </Card>
        </Animated.View>

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Detalhes</Text>

        <Card style={styles.categoriesCard}>
          {categoryData.length > 0 ? (
            categoryData.map((cat, index) => (
              <CategoryItem
                key={cat.name}
                name={cat.name}
                amount={cat.amount}
                percentage={totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100) : 0}
                color={cat.color}
                icon={cat.icon as any}
                delay={300 + index * 50}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma transação registrada ainda</Text>
          )}
        </Card>

        {/* Dica */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Card style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb" size={24} color={colors.success} />
              <Badge text="Dica" color={colors.success} style={styles.tipBadge} />
            </View>
            <Text style={styles.tipText}>
              Você gastou 15% a menos em transporte este mês! Continue assim. 🚀
            </Text>
          </Card>
        </Animated.View>

        {/* Botão Adicionar */}
        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={24} color={colors.card} />
            <Text style={styles.addButtonText}>Adicionar Transação</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Modal de Adicionar Transação */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Transação</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Tipo */}
            <View style={styles.typeContainer}>
              <Pressable
                style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonActive]}
                onPress={() => setTransactionType('expense')}
              >
                <Text style={[styles.typeText, transactionType === 'expense' && styles.typeTextActive]}>
                  Despesa
                </Text>
              </Pressable>
              <Pressable
                style={[styles.typeButton, transactionType === 'income' && styles.typeButtonActive]}
                onPress={() => setTransactionType('income')}
              >
                <Text style={[styles.typeText, transactionType === 'income' && styles.typeTextActive]}>
                  Receita
                </Text>
              </Pressable>
            </View>

            {/* Valor */}
            <Text style={styles.inputLabel}>Valor</Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              placeholderTextColor={colors.gray400}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            {/* Descrição */}
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Almoço, Salário..."
              placeholderTextColor={colors.gray400}
              value={description}
              onChangeText={setDescription}
            />

            {/* Categoria */}
            <Text style={styles.inputLabel}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                  <Text style={styles.categoryButtonText}>{cat.name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Botões */}
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Adicionar"
                onPress={handleAddTransaction}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.h3,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    backgroundColor: colors.gray200,
    marginHorizontal: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  budgetText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  categoriesCard: {
    marginBottom: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    ...typography.body,
    color: colors.text,
  },
  categoryPercentage: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  categoryAmount: {
    ...typography.h4,
    color: colors.text,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: colors.success + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    marginBottom: spacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipBadge: {
    marginLeft: spacing.sm,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  addButtonText: {
    ...typography.button,
    color: colors.card,
    marginLeft: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
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
    maxHeight: '90%',
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
  typeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  typeText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
  categoryScroll: {
    marginBottom: spacing.lg,
  },
  categoryButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    marginRight: spacing.sm,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryButtonText: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs / 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
});
