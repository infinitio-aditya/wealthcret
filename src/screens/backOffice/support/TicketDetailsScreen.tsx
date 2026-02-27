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
import { useAlert } from "context/AlertContext";
import {
  useRetrieveSupportTicketQuery,
  useGetSupportTicketMessagesQuery,
  useCreateSupportTicketMessageMutation,
  useUpdateSupportTicketMutation,
} from "../../../services/backend/supportApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  SupportTicket,
  SupportTicketMessage as BackendMessage,
} from "../../../types/backend/support";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../../../hooks/useTheme";
import LinearGradient from "react-native-linear-gradient";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import Header from "../../../components/Header";
import { mockServiceProviders } from "../../../utils/mockData";

const TicketDetailsScreen = () => {
  const theme = useTheme();
  const { showAlert } = useAlert();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
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
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { ticketId } = route.params;
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: ticket, isLoading: isLoadingTicket } =
    useRetrieveSupportTicketQuery(Number(ticketId));
  const { data: backendMessages, refetch: refetchMessages } =
    useGetSupportTicketMessagesQuery(Number(ticketId));
  const [createMessage] = useCreateSupportTicketMessageMutation();
  const [updateTicket] = useUpdateSupportTicketMutation();

  const [messageText, setMessageText] = useState("");
  const [ticketStatus, setTicketStatus] = useState<
    "open" | "in-progress" | "resolved" | "closed"
  >("open");

  useEffect(() => {
    if (ticket) {
      const statusMap: Record<number, any> = {
        0: "open",
        1: "in-progress",
        2: "resolved",
        3: "closed",
      };
      setTicketStatus(statusMap[ticket.status] || "open");
    }
  }, [ticket]);

  const scrollViewRef = useRef<ScrollView>(null);

  // User role check
  const isAdmin = user?.role === "admin";

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
            colors={[theme.colors.primary, theme.colors.primary + "80"]}
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

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await createMessage({
        support_ticket: Number(ticketId),
        message: messageText,
        user: Number(user?.id),
      }).unwrap();

      setMessageText("");
      refetchMessages();
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    } catch (error) {
      showAlert("Error", "Failed to send message");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const statusReverseMap: Record<string, number> = {
      open: 0,
      "in-progress": 1,
      resolved: 2,
      closed: 3,
    };

    try {
      await updateTicket({
        id: Number(ticketId),
        status: statusReverseMap[newStatus],
      }).unwrap();

      setTicketStatus(newStatus as any);
      showAlert(
        "Status Updated",
        `Ticket status changed to ${newStatus.replace("-", " ")}`,
      );
    } catch (error) {
      showAlert("Error", "Failed to update status");
    }
  };

  // const handleCloseTicket = () => {
  //   showAlert(
  //     "Close Ticket",
  //     "Are you sure you want to close this ticket?",
  //     [
  //       {
  //         text: "Cancel",
  //         style: "cancel",
  //       },
  //       {
  //         text: "Close",
  //         onPress: () => handleStatusChange("closed"),
  //         style: "destructive",
  //       },
  //     ],
  //     { cancelable: true },
  //   );
  // };

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
                      <Icon
                        name="check"
                        size={12}
                        color={theme.colors.textOnPrimary}
                      />
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.container}
    >
      <ScrollView>
        <Header
          title={ticket.title}
          subtitle={`Ticket #${ticket.id}`}
          showBack
        />
        <View style={styles.content}>
          {renderStatusProgress()}

          {(user?.role === "admin" || user?.role === "service_provider") && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ticket Management</Text>
              <ThemeDropdown
                label="Assign Service Provider"
                options={spOptions}
                selectedValue={ticket?.assigned_to_user || ""}
                onValueChange={async (value) => {
                  try {
                    await updateTicket({
                      id: Number(ticketId),
                      assigned_to_user: value,
                    }).unwrap();
                    showAlert("Success", `Ticket assigned to ${value}`);
                  } catch (error) {
                    showAlert("Error", "Failed to assign provider");
                  }
                }}
                placeholder="Select Service Provider"
              />
              <View style={{ marginTop: 12 }}>
                <ThemeDropdown
                  label="Update Status"
                  options={statusOptions}
                  selectedValue={ticketStatus}
                  onValueChange={handleStatusChange}
                  placeholder="Select Status"
                />
              </View>
              {ticketStatus !== "closed" && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    showAlert(
                      "Close Ticket",
                      "Are you sure you want to close this ticket?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Close",
                          style: "destructive",
                          onPress: () => {
                            setTicketStatus("closed");
                            showAlert("Success", "Ticket has been closed");
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
              <Text
                style={styles.detailValue}
              >{`${ticket.user?.first_name} ${ticket.user?.last_name}`}</Text>
            </View>

            <View style={[styles.detailRow, { width: "50%" }]}>
              <Text style={styles.detailLabel}>Assigned To</Text>
              <Text style={styles.detailValue}>
                {ticket.assigned_to_user || "Unassigned"}
              </Text>
            </View>

            <View style={[styles.detailRow, { width: "50%" }]}>
              <Text style={styles.detailLabel}>Created Date</Text>
              <Text style={styles.detailValue}>
                {new Date(ticket.created).toLocaleString()}
              </Text>
            </View>

            <View style={[styles.detailRow, { width: "50%" }]}>
              <Text style={styles.detailLabel}>Priority</Text>
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor: theme.colors.warning + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color: theme.colors.warning,
                    },
                  ]}
                >
                  Medium
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
              {(backendMessages || []).map((msg, index) => {
                const isOwn = Number(msg.user) === Number(user?.id);
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
                          ? [theme.colors.primary, theme.colors.primary + "80"]
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
                            {
                              color: isOwn
                                ? theme.colors.textOnPrimary
                                : theme.colors.text,
                            },
                          ]}
                        >
                          {msg.sender_name || "System"}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.messageText,
                          {
                            color: isOwn
                              ? theme.colors.textOnPrimary
                              : theme.colors.text,
                          },
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
                        {new Date(msg.created).toLocaleTimeString([], {
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
            colors={[theme.colors.primary, theme.colors.primary + "80"]}
            style={styles.sendButton}
          >
            <Icon name="send" size={18} color={theme.colors.textOnPrimary} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TicketDetailsScreen;
