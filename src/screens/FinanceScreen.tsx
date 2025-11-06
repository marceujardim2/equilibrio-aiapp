import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../components';
import { spacing as spacingTokens, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme';
import { useThemedColors } from '../hooks/useThemedColors';
import Summary from '../components/Finance/Summary';
import MonthlyBudget from '../components/Finance/MonthlyBudget';
import SpendChart from '../components/Finance/SpendChart';
import Transactions from '../components/Finance/Transactions';
import HeroBalance from '../components/Finance/HeroBalance';
import SummaryCards from '../components/Finance/SummaryCards';
import FinanceHeader from '../components/Finance/FinanceHeader';
import Section from '../components/Finance/Section';
import CategoriesList from '../components/Finance/CategoriesList';
import FloatingAddButton from '../components/Finance/FloatingAddButton';
import HeroSection from '../components/Finance/HeroSection';
import EmptyStateCard from '../components/Finance/EmptyStateCard';
import { auth } from '../services/firebase';

interface CategoryItemProps {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  delay: number;
}

const baseCategories = (c: ReturnType<typeof useThemedColors>) => ([
  { id: 'food', name: 'Alimentação', icon: 'restaurant', color: c.error },
  { id: 'transport', name: 'Transporte', icon: 'car', color: c.warning },
  { id: 'leisure', name: 'Lazer', icon: 'game-controller', color: c.accent },
  { id: 'health', name: 'Saúde', icon: 'fitness', color: c.success },
  { id: 'others', name: 'Outros', icon: 'ellipsis-horizontal', color: c.textSecondary },
]);

export default function FinanceScreen() {
  const colors = useThemedColors();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [budget, setBudget] = useState(2000);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState('2000');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
    loadBudget();
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

  const loadBudget = async () => {
    try {
      const userId = auth.currentUser?.uid || 'guest';
      const data = await AsyncStorage.getItem(`budget_${userId}`);
      if (data) {
        setBudget(parseFloat(data));
        setNewBudget(data);
      }
    } catch (error) {
      console.error('Erro ao carregar orçamento:', error);
    }
  };

  const handleSaveBudget = async () => {
    if (!newBudget || parseFloat(newBudget) <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido para o orçamento');
      return;
    }

    try {
      const userId = auth.currentUser?.uid || 'guest';
      await AsyncStorage.setItem(`budget_${userId}`, newBudget);
      setBudget(parseFloat(newBudget));
      setBudgetModalVisible(false);
      Alert.alert('Sucesso!', 'Orçamento atualizado');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o orçamento');
    }
  };

  const handleAddTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido');
      return;
    }

    try {
      const userId = auth.currentUser?.uid || 'guest';
      
      if (editingId) {
        // Editar transação existente
        const updatedTransactions = transactions.map(t =>
          t.id === editingId
            ? {
                ...t,
                type: transactionType,
                amount: parseFloat(amount),
                category: selectedCategory,
                description: description || 'Sem descrição',
              }
            : t
        );
        setTransactions(updatedTransactions);
        await AsyncStorage.setItem(`transactions_${userId}`, JSON.stringify(updatedTransactions));
        Alert.alert('Sucesso!', 'Transação atualizada');
      } else {
        // Adicionar nova transação
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
        await AsyncStorage.setItem(`transactions_${userId}`, JSON.stringify(updatedTransactions));
        Alert.alert('Sucesso!', 'Transação adicionada');
      }

      setModalVisible(false);
      setAmount('');
      setDescription('');
      setSelectedCategory('food');
      setEditingId(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação');
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setSelectedCategory(transaction.category);
    setTransactionType(transaction.type);
    setEditingId(transaction.id);
    setModalVisible(true);
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = auth.currentUser?.uid || 'guest';
              const updated = transactions.filter(t => t.id !== id);
              setTransactions(updated);
              await AsyncStorage.setItem(`transactions_${userId}`, JSON.stringify(updated));
              Alert.alert('Sucesso!', 'Transação excluída');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir');
            }
          },
        },
      ]
    );
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

    return baseCategories(colors).map(cat => ({
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
    legendFontColor: colors.textPrimary,
  }));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.springify()}>
          <HeroSection
            title="Finanças"
            subtitle="Controle seus gastos com equilíbrio"
            balance={income - expenses}
            income={income}
            expense={expenses}
            saved={Math.max(income - expenses, 0)}
            remaining={remaining}
            budget={budget}
            onAdd={() => setModalVisible(true)}
            onEditBudget={() => setBudgetModalVisible(true)}
          />
        </Animated.View>

        {/* Gráfico + CTA (somente se houver dados de categoria) */}
        {categoryData.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Section title="Gastos por categoria">
              <SpendChart data={categoryData} />
            </Section>
          </Animated.View>
        )}

        {/* Categorias detalhadas (mantemos se houver dados) */}
        {categoryData.length > 0 && (
          <Section title="Detalhes">
            <CategoriesList
              data={categoryData.map((cat) => ({
                name: cat.name,
                amount: cat.amount,
                percentage: totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100) : 0,
                color: cat.color,
                icon: cat.icon as any,
              }))}
            />
          </Section>
        )}

        {/* Lista de Transações Recentes */}
        {transactions.length > 0 ? (
          <Section
            title="Transações Recentes"
            footer={(
              <Pressable style={styles.ctaLink} onPress={() => {}}>
                <Text style={[styles.ctaText, { color: colors.primary }]}>Ver todas</Text>
              </Pressable>
            )}
          >
            <Transactions
              transactions={transactions.slice(-10).reverse() as any}
              onEdit={handleEditTransaction as any}
              onDelete={handleDeleteTransaction}
            />
          </Section>
        ) : (
          <EmptyStateCard title="Nenhuma transação ainda" subtitle="Adicione sua primeira transação para começar a visualizar seus gastos e receitas." />
        )}

        {/* Botão Adicionar */}
        <FloatingAddButton onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal de Adicionar Transação */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Transação</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
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
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Valor</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="R$ 0,00"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            {/* Descrição */}
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Descrição</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="Ex: Almoço, Salário..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
            />

            {/* Categoria */}
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {baseCategories(colors).map(cat => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    { borderColor: colors.border },
                    selectedCategory === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                  <Text style={[styles.categoryButtonText, { color: colors.textPrimary }]}>{cat.name}</Text>
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

      {/* Modal de Editar Orçamento */}
      <Modal
        visible={budgetModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBudgetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Definir Orçamento Mensal</Text>
              <Pressable onPress={() => setBudgetModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Valor do Orçamento</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="R$ 0,00"
              placeholderTextColor={colors.textSecondary}
              value={newBudget}
              onChangeText={setNewBudget}
              keyboardType="numeric"
            />
            <Text style={styles.inputHint}>
              Este é o valor máximo que você planeja gastar por mês
            </Text>

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setBudgetModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Salvar"
                onPress={handleSaveBudget}
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
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacingTokens.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: spacingTokens.xs,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacingTokens.lg,
  },
  summaryCard: {
    marginBottom: spacingTokens.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacingTokens.md,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacingTokens.xs,
  },
  summaryValue: {
    ...typography.h3,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    marginHorizontal: spacingTokens.md,
  },
  progressBar: {
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacingTokens.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  budgetText: {
    ...typography.caption,
    textAlign: 'center',
  },
  chartCard: {
    alignItems: 'center',
    marginBottom: spacingTokens.md,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacingTokens.md,
  },
  categoriesCard: {
    marginBottom: spacingTokens.md,
  },
  tipCard: {
    borderLeftWidth: 4,
    marginBottom: spacingTokens.md,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingTokens.sm,
  },
  tipBadge: {
    marginLeft: spacingTokens.sm,
  },
  tipText: {
    ...typography.body,
    lineHeight: 22,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacingTokens.md,
    borderRadius: borderRadius.md,
    marginBottom: spacingTokens.xl,
  },
  addButtonText: {
    ...typography.button,
    marginLeft: spacingTokens.sm,
  },
  ctaLink: { alignItems: 'flex-end', marginBottom: spacingTokens.md },
  ctaText: { ...typography.caption, fontWeight: '600' },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    padding: spacingTokens.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacingTokens.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingTokens.lg,
  },
  modalTitle: {
    ...typography.h3,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: spacingTokens.md,
    gap: spacingTokens.sm,
  },
  typeButton: {
    flex: 1,
    padding: spacingTokens.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    
    alignItems: 'center',
  },
  typeButtonActive: {},
  typeText: {
    ...typography.body,
  },
  typeTextActive: {
    fontWeight: '600',
  },
  inputLabel: {
    ...typography.body,
    marginBottom: spacingTokens.xs,
    fontWeight: '600',
  },
  input: {
    ...typography.body,
    padding: spacingTokens.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacingTokens.md,
  },
  categoryScroll: {
    marginBottom: spacingTokens.lg,
  },
  categoryButton: {
    padding: spacingTokens.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    marginRight: spacingTokens.sm,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryButtonText: {
    ...typography.caption,
    marginTop: spacingTokens.xs / 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacingTokens.sm,
  },
  modalButton: {
    flex: 1,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacingTokens.sm,
  },
  editBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingTokens.xs / 2,
  },
  editBudgetText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  inputHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -spacingTokens.sm,
    marginBottom: spacingTokens.md,
  },
  transactionsCard: {
    marginBottom: spacingTokens.md,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingTokens.md,
    borderBottomWidth: 1,
    
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingTokens.sm,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    ...typography.body,
    fontWeight: '600',
  },
  transactionDate: {
    ...typography.caption,
    marginTop: spacingTokens.xs / 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: spacingTokens.xs / 2,
  },
  transactionActions: {
    flexDirection: 'row',
    gap: spacingTokens.sm,
  },
  actionButton: {
    padding: spacingTokens.xs / 2,
  },
});
