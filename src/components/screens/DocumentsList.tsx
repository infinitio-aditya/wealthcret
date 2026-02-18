import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import Card from "../ui/Card";
import Icon from "react-native-vector-icons/Ionicons";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url?: string;
}

interface DocumentsListProps {
  documents: Document[];
  title?: string;
  onDocumentPress?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  title = "Documents",
  onDocumentPress,
  onDelete,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: 10,
      letterSpacing: 1,
    },
    documentItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    documentItemLast: {
      borderBottomWidth: 0,
    },
    documentInfo: {
      flex: 1,
    },
    documentName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 2,
    },
    documentMeta: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    documentIcon: {
      marginLeft: 12,
    },
  });

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Card>
        {documents.map((doc, index) => (
          <View
            key={doc.id}
            style={[
              styles.documentItem,
              index === documents.length - 1 && styles.documentItemLast,
            ]}
          >
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{doc.name}</Text>
              <Text style={styles.documentMeta}>
                {doc.type} • {doc.uploadDate}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => onDocumentPress && onDocumentPress(doc)}
                style={{ marginRight: 12 }}
              >
                <Icon name="eye-outline" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete && onDelete(doc)}>
                <Icon name="trash-outline" size={22} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
};

export default DocumentsList;
