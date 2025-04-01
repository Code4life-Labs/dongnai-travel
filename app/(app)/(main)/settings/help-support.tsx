import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FC } from '@/components';
import { faq } from '@/utils/faq';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Styles } from '@/styles';
import { useTheme } from '@/hooks/useTheme';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  questions: FAQItem[];
}

interface FAQData {
  [key: string]: FAQCategory;
}

export default function HelpSupport() {
  const { theme } = useTheme();
  const faqData = faq.help_support_faq as FAQData;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getIcon = (categoryKey: string) => {
    switch (categoryKey) {
      case 'search_discovery':
        return <AntDesign name="search1" size={20} style={styles.icon} />;
      case 'location_info':
        return <Ionicons name="information-circle-outline" size={20} style={styles.icon} />;
      case 'travel_blog':
        return <FontAwesome name="book" size={20} style={styles.icon} />;
      case 'chatbot_support':
        return <Ionicons name="chatbubble-ellipses" size={20} style={styles.icon} />;
      case 'account_settings':
        return <Feather name="user" size={20} style={styles.icon} />;
      case 'technical_issues':
        return <MaterialIcons name="report-problem" size={20} style={styles.icon} />;
      case 'privacy_security':
        return <Ionicons name="shield-checkmark" size={20} style={styles.icon} />;
      default:
        return <AntDesign name="questioncircleo" size={20} style={styles.icon} />;
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trợ giúp & Hỗ trợ</Text>
        <Text style={styles.subtitle}>Các câu hỏi thường gặp khi sử dụng ứng dụng</Text>
      </View>

      {Object.entries(faqData).map(([categoryKey, category]) => (
        <View key={categoryKey} style={styles.categoryContainer}>
          <TouchableOpacity 
            style={[styles.categoryButton, { backgroundColor: theme.subBackground }]}
            onPress={() => toggleCategory(categoryKey)}
          >
            <View style={styles.leftContent}>
              {getIcon(categoryKey)}
              <Text style={[styles.categoryTitle, { color: theme.onSubBackground }]}>
                {category.title || categoryKey.replace('_', ' ')}
              </Text>
            </View>
            <AntDesign 
              name={expandedCategory === categoryKey ? "down" : "right"} 
              size={22} 
              color={theme.onSubBackground}
            />
          </TouchableOpacity>
          
          {expandedCategory === categoryKey && (
            <View style={[styles.questionsContainer, { backgroundColor: theme.subBackground }]}>
              {category.questions.map((item, index) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={[styles.questionText, { color: theme.onSubBackground }]}>
                    {item.question}
                  </Text>
                  <Text style={[styles.answerText, { color: theme.onSubBackground }]}>
                    {item.answer}
                  </Text>
                </View>
              ))}
              <View style={[styles.divider, { borderBottomColor: theme.onBackground }]} />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 24,
  },
  title: {
    ...Styles.typography.fonts.normal.bolder.h5,
    marginBottom: 22,
    textAlign: 'center',
  },
  subtitle: {
    ...Styles.typography.size.sz_16,
    marginTop: 4,
    textAlign: 'center',
  },
  categoryContainer: {
    width: '100%',
    marginBottom: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    ...Styles.typography.size.sz_16,
    fontWeight: '500',
    marginLeft: 12,
  },
  icon: {
    marginRight: 8,
  },
  questionsContainer: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  questionItem: {
    paddingVertical: 5,
  },
  questionText: {
    ...Styles.typography.size.sz_16,
    marginBottom: 4,
  },
  answerText: {
    ...Styles.typography.fonts.normal.normal.sub0,
  },
  divider: {
    borderBottomWidth: 1.5,
    marginTop: 12,
  },
});
