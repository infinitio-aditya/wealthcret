import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../hooks/useTheme";
import { RootState } from "../store";
import { setTheme } from "../store/slices/themeSlice";
import { themes } from "../theme/themes";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const ThemeSelectionScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentThemeId = useSelector(
    (state: RootState) => state.theme.currentTheme,
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSelectTheme = (themeId: string) => {
    dispatch(setTheme(themeId));
  };

  const renderThemeItem = ({ item }: { item: (typeof themes)[0] }) => {
    const isSelected = currentThemeId === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleSelectTheme(item.id)}
        activeOpacity={0.8}
      >
        <Card
          style={[
            styles.themeCard,
            {
              borderColor: isSelected
                ? theme.colors.primary
                : item.colors.border,
              borderWidth: isSelected ? 2 : 1,
              backgroundColor: item.colors.background,
            },
          ]}
        >
          <View style={styles.cardContent}>
            <View
              style={[
                styles.previewCircle,
                { backgroundColor: item.colors.primary },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.themeName, { color: item.colors.text }]}>
                {item.name}
              </Text>
              <View style={{ flexDirection: "row", gap: 4, marginTop: 4 }}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: item.colors.secondary },
                  ]}
                />
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: item.colors.accent },
                  ]}
                />
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: item.colors.surface },
                  ]}
                />
              </View>
            </View>
            {isSelected && (
              <Icon
                name="checkmark-circle"
                size={24}
                color={theme.colors.primary}
              />
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginLeft: 16,
    },
    listContainer: {
      padding: 16,
    },
    themeCard: {
      marginBottom: 12,
      padding: 16,
      borderRadius: 12,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    previewCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    themeName: {
      fontSize: 16,
      fontWeight: "600",
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
  });

  if (user?.role === "client") {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <Icon
          name="lock-closed-outline"
          size={48}
          color={theme.colors.textSecondary}
        />
        <Text
          style={{
            marginTop: 16,
            fontSize: 18,
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          Access Restricted
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: "center",
          }}
        >
          Theme customization is not available for your account type.
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24, width: "100%" }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Theme</Text>
      </View>
      <FlatList
        data={themes}
        renderItem={renderThemeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ThemeSelectionScreen;
