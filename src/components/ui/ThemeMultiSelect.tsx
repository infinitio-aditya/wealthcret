import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../hooks/useTheme";
import ThemeBottomSheet from "./ThemeBottomSheet";

interface DropdownOption {
  label: string;
  value: string;
}

interface ThemeMultiSelectProps {
  label?: string;
  options: DropdownOption[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
}

const ThemeMultiSelect: React.FC<ThemeMultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onValuesChange,
  placeholder = "Select options",
  error,
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onValuesChange(selectedValues.filter((v) => v !== value));
    } else {
      onValuesChange([...selectedValues, value]);
    }
  };

  const getSelectedLabels = () => {
    if (selectedValues.length === 0) return placeholder;
    return options
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label)
      .join(", ");
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontWeight: "500",
      marginLeft: 4,
    },
    dropdownButton: {
      backgroundColor: theme.effects.glassBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.effects.cardBorder,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 50,
    },
    selectedText: {
      fontSize: 16,
      color: selectedValues.length > 0 ? theme.colors.text : theme.colors.textSecondary,
      flex: 1,
      marginRight: 8,
    },
    error: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: 4,
      marginLeft: 4,
    },
    optionItem: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "20",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    selectedOptionText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    checkboxSelected: {
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText} numberOfLines={1}>
          {getSelectedLabels()}
        </Text>
        <Icon
          name="chevron-down"
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}

      <ThemeBottomSheet
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
      >
        <ScrollView style={{ maxHeight: 400, paddingBottom: 20 }}>
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={styles.optionItem}
                onPress={() => toggleOption(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && (
                    <Icon name="checkmark" size={14} color="#FFF" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={{ marginTop: 16, marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
            }}
            onPress={() => setIsOpen(false)}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>Done</Text>
          </TouchableOpacity>
        </View>
      </ThemeBottomSheet>
    </View>
  );
};

export default ThemeMultiSelect;
