import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../../../hooks/useTheme";
import { mockTickets, mockServiceProviders } from "../../../utils/mockData";
import { TicketMessage } from "../../../types";
import LinearGradient from "react-native-linear-gradient";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";

const TicketDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { ticketId } = route.params;

  // In real app, we would fetch or select from store. Here we find in mockData.
  const ticket = mockTickets.find((t) => t.id === ticketId);

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<TicketMessage[]>(
    ticket?.messages || [],
  );
  const [assignedSP, setAssignedSP] = useState(ticket?.assignedTo || "");
  const [ticketStatus, setTicketStatus] = useState<
    "open" | "in-progress" | "resolved" | "closed"
  >(ticket?.status || "open");
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock current user
  const currentUser = { name: "Admin User", role: "admin" };
  const isAdmin = currentUser.role === "admin"; // Logic for user role check

  const STATUSES = ["open", "in-progress", "resolved", "closed"];

  const spOptions = mockServiceProviders.map((sp) => ({
    label: sp.name,
    value: sp.name,
  }));

  const statusOptions = STATUSES.map((status) => ({
    label: status.replace("-", " "),
    value: status,
  }));

  useEffect(() => {
    // Scroll to bottom on load
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: false }),
      100,
    );
  }, []);

  if (!ticket) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: theme.colors.text }}>Ticket not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={theme.effects.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              gap: 8,
              marginTop: 20,
            }}
          >
            <Icon name="arrow-left" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600" }}>Go Back</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return theme.colors.info;
      case "in-progress":
        return theme.colors.warning;
      case "resolved":
        return theme.colors.success;
      case "closed":
        return theme.colors.textSecondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: TicketMessage = {
      id: Date.now().toString(),
      ticketId: ticket.id,
      sender: currentUser.name,
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      100,
    );
  };

  const handleStatusChange = (newStatus: string) => {
    setTicketStatus(newStatus as any);
    // In a real app, you would send this update to your backend
    Alert.alert(
      "Status Updated",
      `Ticket status changed to ${newStatus.replace("-", " ")}`,
    );
  };

  const handleCloseTicket = () => {
    Alert.alert(
      "Close Ticket",
      "Are you sure you want to close this ticket?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Close",
          onPress: () => handleStatusChange("closed"),
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  const renderStatusProgress = () => {
    // Simple linear mapping for progress example
    // open -> 0, in-progress -> 1, resolved -> 2, closed -> 3
    const currentIdx = STATUSES.indexOf(ticketStatus);
    const progressWidth = (currentIdx / (STATUSES.length - 1)) * 100;

    return (
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
            Ticket Status Progress
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(ticketStatus) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(ticketStatus) },
              ]}
            >
              {ticketStatus.replace("-", " ")}
            </Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressWidth}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
          <View style={styles.stepsContainer}>
            {STATUSES.map((status, index) => {
              const isCompleted = index <= currentIdx;
              const isCurrent = index === currentIdx;
              return (
                <View key={status} style={styles.stepWrapper}>
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: isCompleted
                          ? theme.colors.primary
                          : theme.colors.surface,
                        borderColor: isCompleted
                          ? theme.colors.primary
                          : theme.effects.cardBorder,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    {isCompleted && (
                      <Icon name="check" size={12} color="#fff" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isCurrent
                          ? theme.colors.text
                          : theme.colors.textSecondary,
                        fontWeight: isCurrent ? "600" : "400",
                      },
                    ]}
                  >
                    {status.replace("-", " ")}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      flex: 1,
    },
    headerSubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    content: {
      padding: 16,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      // shadow
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    // Progress Styles
    progressContainer: {
      marginVertical: 8,
    },
    progressBarBackground: {
      height: 4,
      backgroundColor: theme.effects.cardBorder,
      borderRadius: 2,
      position: "absolute",
      top: 12, // Half of circle height (24/2)
      left: 0,
      right: 0,
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 2,
    },
    stepsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    stepWrapper: {
      alignItems: "center",
      width: 60,
    },
    stepCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: theme.colors.surface,
      zIndex: 1,
    },
    stepLabel: {
      fontSize: 10,
      textTransform: "capitalize",
      textAlign: "center",
    },
    // Info Styles
    detailRow: {
      marginBottom: 12,
    },
    detailLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 14,
      color: theme.colors.text,
    },
    priorityBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    priorityText: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    // Chat Styles
    messageList: {
      maxHeight: 400,
    },
    messageBubble: {
      maxWidth: "80%",
      padding: 12,
      borderRadius: 16,
      marginBottom: 12,
    },
    ownMessage: {
      alignSelf: "flex-end",
      borderBottomRightRadius: 4,
    },
    otherMessage: {
      alignSelf: "flex-start",
      backgroundColor: theme.effects.glassBackground, // or surface
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderBottomLeftRadius: 4,
    },
    senderName: {
      fontSize: 12,
      marginBottom: 4,
      fontWeight: "600",
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    timestamp: {
      fontSize: 10,
      marginTop: 4,
      opacity: 0.7,
      alignSelf: "flex-end",
    },
    inputContainer: {
      flexDirection: "row",
      padding: 12,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.effects.cardBorder,
      alignItems: "center",
      gap: 12,
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      maxHeight: 100,
      color: theme.colors.text,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    actionRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 12,
    },
    closeButton: {
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.error,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    closeButtonText: {
      color: theme.colors.error,
      fontWeight: "600",
      fontSize: 14,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{ticket.title}</Text>
            <Text style={styles.headerSubtitle}>Ticket #{ticket.id}</Text>
          </View>
        </View>
        <View style={styles.content}>
          {renderStatusProgress()}

          {(currentUser.role === "admin" ||
            currentUser.role === "service_provider") && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ticket Management</Text>
              <ThemeDropdown
                label="Assign Service Provider"
                options={spOptions}
                selectedValue={assignedSP}
                onValueChange={(value) => {
                  setAssignedSP(value);
                  Alert.alert("Success", `Ticket assigned to ${value}`);
                }}
                placeholder="Select Service Provider"
              />
              <View style={{ marginTop: 12 }}>
                <ThemeDropdown
                  label="Update Status"
                  options={statusOptions}
                  selectedValue={ticketStatus}
                  onValueChange={(value) => {
                    setTicketStatus(value as any);
                    Alert.alert(
                      "Success",
                      `Status updated to ${value.replace("-", " ")}`,
                    );
                  }}
                  placeholder="Select Status"
                />
              </View>
              {ticketStatus !== "closed" && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    Alert.alert(
                      "Close Ticket",
                      "Are you sure you want to close this ticket?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Close",
                          style: "destructive",
                          onPress: () => {
                            setTicketStatus("closed");
                            Alert.alert("Success", "Ticket has been closed");
                          },
                        },
                      ],
                    );
                  }}
                >
                  <Text style={styles.closeButtonText}>Close Ticket</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View
            style={[styles.card, { flexDirection: "row", flexWrap: "wrap" }]}
          >
            <View style={{ width: "100%" }}>
              <Text style={styles.cardTitle}>Ticket Details</Text>
            </View>

            <View style={[styles.detailRow, { width: "100%" }]}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{ticket.description}</Text>
            </View>

            <View style={[styles.detailRow, { width: "50%" }]}>
              <Text style={styles.detailLabel}>Created By</Text>
              <Text style={styles.detailValue}>{ticket.createdBy}</Text>
            </View>

            <View style={[styles.detailRow, { width: "50%" }]}>
              <Text style={styles.detailLabel}>Assigned To</Text>
              <Text style={styles.detailValue}>
                {assignedSP || "Unassigned"}
              </Text>
            </View>

            <View style={[styles.detailRow, { width: "50%" }]}>
              <Text style={styles.detailLabel}>Created Date</Text>
              <Text style={styles.detailValue}>
                {new Date(ticket.createdAt).toLocaleString()}
              </Text>
            </View>

            <View style={[styles.detailRow, { width: "50%" }]}>
              <Text style={styles.detailLabel}>Priority</Text>
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor:
                      (ticket.priority === "high"
                        ? theme.colors.error
                        : ticket.priority === "medium"
                          ? theme.colors.warning
                          : theme.colors.success) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color:
                        ticket.priority === "high"
                          ? theme.colors.error
                          : ticket.priority === "medium"
                            ? theme.colors.warning
                            : theme.colors.success,
                    },
                  ]}
                >
                  {ticket.priority}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Conversation</Text>
            <ScrollView
              ref={scrollViewRef}
              style={{ maxHeight: 300 }}
              nestedScrollEnabled
            >
              {messages.map((msg, index) => {
                const isOwn = msg.sender === currentUser.name;
                return (
                  <View
                    key={msg.id || index}
                    style={[
                      styles.messageBubble,
                      isOwn ? styles.ownMessage : styles.otherMessage,
                      isOwn ? {} : { backgroundColor: theme.colors.background }, // fallback
                    ]}
                  >
                    <LinearGradient
                      colors={
                        isOwn
                          ? theme.effects.buttonGradient
                          : ["transparent", "transparent"]
                      }
                      style={{ borderRadius: 16, padding: 12 }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={[
                            styles.senderName,
                            { color: isOwn ? "#fff" : theme.colors.text },
                          ]}
                        >
                          {msg.sender}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.messageText,
                          { color: isOwn ? "#fff" : theme.colors.text },
                        ]}
                      >
                        {msg.message}
                      </Text>
                      <Text
                        style={[
                          styles.timestamp,
                          {
                            color: isOwn
                              ? "rgba(255,255,255,0.7)"
                              : theme.colors.textSecondary,
                          },
                        ]}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </LinearGradient>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor={theme.colors.textSecondary}
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <LinearGradient
            colors={theme.effects.buttonGradient}
            style={styles.sendButton}
          >
            <Icon name="send" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TicketDetailsScreen;
