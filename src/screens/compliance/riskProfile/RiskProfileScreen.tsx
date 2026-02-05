import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useTheme } from '../../../hooks/useTheme';
import ThemeDropdown from '../../../components/ui/ThemeDropdown';
import ThemeBottomSheet from '../../../components/ui/ThemeBottomSheet';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import { RiskProfile, QuizQuestion } from '../../../types';
import {
  mockRiskProfiles,
  mockServiceProviders,
  mockReferralPartners,
} from '../../../utils/mockData';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SupportStackParamList } from '../../../navigation/NavigationParams';
import LinearGradient from 'react-native-linear-gradient';

type RiskProfileScreenNavigationProp = StackNavigationProp<
  SupportStackParamList,
  'RiskProfile'
>;

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    text: 'What is your primary investment goal?',
    options: [
      { id: '1a', text: 'Capital Preservation', score: 1 },
      { id: '1b', text: 'Retirement Planning', score: 3 },
      { id: '1c', text: 'Wealth Creation', score: 5 },
    ],
    category: 'Goals',
  },
  {
    id: '2',
    text: 'How long do you plan to invest your money?',
    options: [
      { id: '2a', text: 'Less than 1 year', score: 1 },
      { id: '2b', text: '3-5 years', score: 3 },
      { id: '2c', text: '10+ years', score: 5 },
    ],
    category: 'Time Horizon',
  },
  {
    id: '3',
    text: 'How would you react if your portfolio dropped by 20% in a month?',
    options: [
      { id: '3a', text: 'Sell everything', score: 1 },
      { id: '3b', text: 'Do nothing', score: 3 },
      { id: '3c', text: 'Buy more', score: 5 },
    ],
    category: 'Risk Appetite',
  },
];

const uniqueAdvisors = mockServiceProviders.map(sp => sp.name);
const uniqueReferralPartners = mockReferralPartners.map(rp => rp.name);

const RiskProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<RiskProfileScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [profiles, setProfiles] = useState<RiskProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<RiskProfile[]>([]);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'low' | 'medium' | 'high',
    assignedSP: 'all',
    referralPartner: 'all',
  });
  const [tempFilters, setTempFilters] = useState({
    status: 'all' as 'all' | 'low' | 'medium' | 'high',
    assignedSP: 'all',
    referralPartner: 'all',
  });

  useEffect(() => {
    setTimeout(() => {
      setProfiles(mockRiskProfiles);
      setFilteredProfiles(mockRiskProfiles);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let result = profiles;
    if (searchQuery) {
      result = result.filter(p =>
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.assignedSP !== 'all') {
      result = result.filter(p => p.assignedSP === filters.assignedSP);
    }
    if (filters.referralPartner !== 'all') {
      result = result.filter(
        p => (p as any).referralPartner === filters.referralPartner,
      );
    }
    setFilteredProfiles(result);
  }, [searchQuery, filters, profiles]);

  const isClient = user?.role === 'client';

  const getScoreColor = (score: number) => {
    if (score < 40) return theme.colors.success; // Low Risk
    if (score < 70) return theme.colors.warning; // Medium Risk
    return theme.colors.error; // High Risk
  };

  const handleStartAssessment = () => {
    setShowAssessment(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswerSelect = (optionScore: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionScore;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate Score based on Web Logic: sum of scores / max possible * 100
      // Simplified for this mock: average score scaled to 100
      const totalScore = answers.reduce((a, b) => a + b, 0);
      const maxPossible = mockQuizQuestions.length * 5;
      const finalScore = Math.round((totalScore / maxPossible) * 100);

      Alert.alert(
        'Assessment Complete',
        `Your calculated risk score is ${finalScore}`,
        [{ text: 'View Profile', onPress: () => setShowAssessment(false) }],
      );
    }
  };

  const renderAssessment = () => (
    <ScrollView
      style={[
        styles.assessmentContainer,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.assessmentHeader}>
        <TouchableOpacity
          onPress={() => setShowAssessment(false)}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.assessmentTitle, { color: theme.colors.text }]}>
            Risk Assessment
          </Text>
          <Text style={styles.assessmentStep}>
            Question {currentQuestion + 1} of {mockQuizQuestions.length}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentQuestion + 1) / mockQuizQuestions.length) * 100}%`,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      </View>

      <Card style={styles.questionCard}>
        <Text style={[styles.categoryLabel, { color: theme.colors.primary }]}>
          {mockQuizQuestions[currentQuestion].category?.toUpperCase()}
        </Text>
        <Text style={[styles.questionText, { color: theme.colors.text }]}>
          {mockQuizQuestions[currentQuestion].text}
        </Text>

        <View style={styles.optionsContainer}>
          {(mockQuizQuestions[currentQuestion].options as any[]).map(
            (option, idx) => {
              const isSelected = answers[currentQuestion] === option.score;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    {
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.effects.cardBorder,
                      backgroundColor: isSelected
                        ? theme.colors.primary + '10'
                        : theme.colors.surface,
                    },
                  ]}
                  onPress={() => handleAnswerSelect(option.score)}
                >
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: isSelected
                          ? theme.colors.primary
                          : theme.colors.text,
                      },
                    ]}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </Card>

      <View style={styles.assessmentButtons}>
        <Button
          title="Previous"
          variant="outline"
          onPress={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          style={{ flex: 1 }}
        />
        <Button
          title={
            currentQuestion === mockQuizQuestions.length - 1
              ? 'Complete'
              : 'Next'
          }
          onPress={handleNext}
          disabled={answers[currentQuestion] === undefined}
          style={{ flex: 1 }}
        />
      </View>
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={[styles.mainTitle, { color: theme.colors.text }]}>
          Risk Profiles
        </Text>
        <Text style={styles.subtitle}>Monitor client risk assessments</Text>
      </View>
      <TouchableOpacity
        style={styles.filterButtonIcon}
        onPress={() => setShowFilters(true)}
      >
        <Icon name="filter" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderStats = () => (
    <View style={[styles.statsRow]}>
      {[
        { label: 'Total', count: profiles.length, color: theme.colors.primary },
        {
          label: 'Low',
          count: profiles.filter(p => p.status === 'low').length,
          color: theme.colors.success,
        },
        {
          label: 'Medium',
          count: profiles.filter(p => p.status === 'medium').length,
          color: theme.colors.warning,
        },
        {
          label: 'High',
          count: profiles.filter(p => p.status === 'high').length,
          color: theme.colors.error,
        },
      ].map((s, i) => (
        <View
          key={i}
          style={[
            styles.miniStatCard,
            { borderColor: theme.effects.cardBorder },
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.miniStatValue, { color: s.color }]}>
            {s.count}
          </Text>
          <Text style={styles.miniStatLabel}>{s.label}</Text>
        </View>
      ))}
    </View>
  );

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const reset = {
      status: 'all' as 'all' | 'low' | 'medium' | 'high',
      assignedSP: 'all',
      referralPartner: 'all',
    };
    setTempFilters(reset);
    setFilters(reset);
    setShowFilters(false);
  };

  const renderFilters = () => (
    <ThemeBottomSheet
      isVisible={showFilters}
      onClose={() => setShowFilters(false)}
      title="Filters"
    >
      <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
        Risk Status
      </Text>
      <View style={styles.filterOptions}>
        {['all', 'low', 'medium', 'high'].map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              tempFilters.status === status
                ? { backgroundColor: theme.colors.primary }
                : { borderColor: theme.effects.cardBorder, borderWidth: 1 },
            ]}
            onPress={() =>
              setTempFilters({ ...tempFilters, status: status as any })
            }
          >
            <Text
              style={[
                styles.filterChipText,
                tempFilters.status === status
                  ? { color: '#fff' }
                  : { color: theme.colors.text },
              ]}
            >
              {status.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ThemeDropdown
        label="Assigned Service Provider"
        options={[
          { label: 'All Advisors', value: 'all' },
          ...uniqueAdvisors.map(ad => ({ label: ad, value: ad })),
        ]}
        selectedValue={tempFilters.assignedSP}
        onValueChange={value =>
          setTempFilters({ ...tempFilters, assignedSP: value })
        }
      />

      <ThemeDropdown
        label="Referral Partner"
        options={[
          { label: 'All Partners', value: 'all' },
          { label: 'None', value: 'None' },
          ...uniqueReferralPartners.map(rp => ({ label: rp, value: rp })),
        ]}
        selectedValue={tempFilters.referralPartner}
        onValueChange={value =>
          setTempFilters({ ...tempFilters, referralPartner: value })
        }
      />

      <View style={[styles.modalButtons, { marginBottom: 20 }]}>
        <Button
          title="Reset All"
          variant="outline"
          onPress={handleResetFilters}
          style={{ flex: 1 }}
        />
        <Button
          title="Apply Filters"
          onPress={handleApplyFilters}
          style={{ flex: 1 }}
        />
      </View>
    </ThemeBottomSheet>
  );

  const renderAdvisorView = () => (
    <View
      style={[
        styles.advisorContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        {renderHeader()}
        {renderStats()}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.effects.cardBorder,
            },
          ]}
        >
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search clients..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredProfiles}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RiskProfileDetails', { profileId: item.id })
            }
          >
            <Card
              style={[
                styles.profileCard,
                { borderColor: theme.effects.cardBorder },
              ]}
            >
              <View style={styles.profileTop}>
                <View
                  style={[
                    styles.scoreCircle,
                    {
                      borderColor: getScoreColor(item.score),
                      backgroundColor: getScoreColor(item.score) + '10',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      { color: getScoreColor(item.score) },
                    ]}
                  >
                    {item.score}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text
                    style={[styles.clientName, { color: theme.colors.text }]}
                  >
                    {item.clientName}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getScoreColor(item.score) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTag,
                        { color: getScoreColor(item.score) },
                      ]}
                    >
                      {item.status.toUpperCase()} RISK
                    </Text>
                  </View>
                </View>
                <Icon
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </View>
              <View
                style={[
                  styles.profileBottom,
                  { borderColor: theme.effects.cardBorder },
                ]}
              >
                <Text style={styles.dateLabel}>
                  Last Assessed:{' '}
                  <Text
                    style={[styles.dateValue, { color: theme.colors.text }]}
                  >
                    {item.lastAssessmentDate}
                  </Text>
                </Text>
                <View style={styles.progressThin}>
                  <View
                    style={[
                      styles.progressFillThin,
                      {
                        width: `${item.score}%`,
                        backgroundColor: getScoreColor(item.score),
                      },
                    ]}
                  />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
      {showFilters && renderFilters()}
    </View>
  );

  const renderClientView = () => (
    <ScrollView
      style={[
        styles.clientContainer,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.header}>
        <Text style={[styles.mainTitle, { color: theme.colors.text }]}>
          Your Risk Profile
        </Text>
        <Text style={styles.subtitle}>
          Manage your investment risk preferences
        </Text>
      </View>

      <LinearGradient
        colors={[theme.colors.surface, theme.colors.surface] as any} // Simplified gradient, could use theme effects
        style={[
          styles.clientProfileCard,
          { borderColor: theme.colors.success + '40', borderWidth: 1 },
        ]}
      >
        <View
          style={[
            styles.largeScoreCircle,
            { borderColor: theme.colors.success },
          ]}
        >
          <Text
            style={[styles.largeScoreText, { color: theme.colors.success }]}
          >
            35
          </Text>
          <Text style={styles.largeScoreLabel}>Low Risk</Text>
        </View>
        <Text style={styles.clientNotice}>
          Your risk profile was last updated on 2025-11-15. We recommend
          reviewing this annually or after major life changes.
        </Text>
        <Button title="Retake Assessment" onPress={handleStartAssessment} />
      </LinearGradient>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Recommendations
      </Text>
      <Card style={[styles.recCard, { backgroundColor: theme.colors.surface }]}>
        <Icon name="shield-checkmark" size={24} color={theme.colors.success} />
        <Text style={[styles.recText, { color: theme.colors.text }]}>
          Based on your low-risk profile, we recommend a balanced exposure with
          a focus on capital preservation and high-quality debt instruments.
        </Text>
      </Card>
    </ScrollView>
  );

  if (loading)
    return (
      <View
        style={[styles.loading, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );

  if (showAssessment) return renderAssessment();

  return isClient ? renderClientView() : renderAdvisorView();
};

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  advisorContainer: { flex: 1 },
  clientContainer: { flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: { marginBottom: 20 },
  mainTitle: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#6A6D70', marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  miniStatCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
  },
  miniStatValue: { fontSize: 20, fontWeight: 'bold' },
  miniStatLabel: {
    fontSize: 10,
    color: '#6A6D70',
    marginTop: 2,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  filterButtonIcon: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },

  // Profile List
  profileCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: { fontSize: 16, fontWeight: 'bold' },
  profileInfo: { flex: 1, marginLeft: 12 },
  clientName: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  statusTag: { fontSize: 10, fontWeight: 'bold' },
  profileBottom: { borderTopWidth: 1, paddingTop: 12 },
  dateLabel: { fontSize: 12, color: '#6A6D70' },
  dateValue: { fontWeight: '500' },
  progressThin: {
    height: 4,
    backgroundColor: '#F0F2F5',
    borderRadius: 2,
    marginTop: 8,
  },
  progressFillThin: { height: '100%', borderRadius: 2 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  filterLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterChipText: { fontSize: 14, fontWeight: '500' },

  // Client View
  clientProfileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  largeScoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  largeScoreText: { fontSize: 40, fontWeight: 'bold' },
  largeScoreLabel: { fontSize: 14, color: '#6A6D70', fontWeight: '600' },
  clientNotice: {
    fontSize: 14,
    color: '#6A6D70',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  recCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#000',
  },
  recText: { flex: 1, fontSize: 13, lineHeight: 18 },

  // Assessment
  assessmentContainer: { flex: 1, backgroundColor: '#F8F9FB' },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: { padding: 4 },
  assessmentTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  assessmentStep: {
    fontSize: 12,
    color: '#6A6D70',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E8EBF0',
    borderRadius: 3,
    marginBottom: 24,
  },
  progressFill: { height: '100%', borderRadius: 3 },
  questionCard: { padding: 20, borderRadius: 20, marginBottom: 24 },
  categoryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: { gap: 12 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  optionLabel: { fontSize: 15, fontWeight: '500' },
  assessmentButtons: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 16,
  },
});

export default RiskProfileScreen;
