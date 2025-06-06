import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { useUserStore } from '@/store/userStore';
import { useEventStore } from '@/store/eventStore';
import ChatMessage from '@/components/ChatMessage';
import { Send, Calendar, X, MapPin, Clock } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { chats, sendMessage } = useChatStore();
  const { getUserById } = useUserStore();
  const { addEvent } = useEventStore();
  
  const [message, setMessage] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDuration, setEventDuration] = useState('60');
  const [eventLocation, setEventLocation] = useState('');
  
  const flatListRef = useRef<FlatList>(null);
  
  const chat = chats.find(c => c.id === id);
  
  if (!chat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Chat not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Get the other user in the chat
  const otherUserId = chat.participants.find(
    id => id !== useUserStore.getState().currentUser?.id
  );
  
  const otherUser = otherUserId ? getUserById(otherUserId) : undefined;
  
  const handleSend = () => {
    if (!message.trim()) return;
    
    sendMessage(id, message.trim());
    setMessage('');
  };
  
  const handleCreateEvent = () => {
    setShowEventModal(true);
  };
  
  const handleSaveEvent = () => {
    if (!eventTitle || !eventDate || !eventTime || !eventDuration || !otherUserId) {
      // Show validation error
      return;
    }
    
    // Combine date and time
    const [year, month, day] = eventDate.split('-').map(Number);
    const [hours, minutes] = eventTime.split(':').map(Number);
    const eventDateTime = new Date(year, month - 1, day, hours, minutes);
    
    // Create event
    addEvent({
      title: eventTitle,
      date: eventDateTime.toISOString(),
      duration: parseInt(eventDuration),
      location: eventLocation,
      participantId: otherUserId,
      chatId: id,
    });
    
    // Send message about the event
    const eventMessage = `📅 I've scheduled "${eventTitle}" on ${eventDateTime.toLocaleDateString()} at ${eventDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.${eventLocation ? ` Location: ${eventLocation}` : ''}`;
    sendMessage(id, eventMessage);
    
    // Close modal and reset fields
    setShowEventModal(false);
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventDuration('60');
    setEventLocation('');
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chat.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chat.messages.length]);
  
  // Format today's date as YYYY-MM-DD for the date input default
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: otherUser?.name || 'Chat',
          headerTitleStyle: { color: theme.colors.text },
          headerStyle: { backgroundColor: theme.colors.background },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>Back</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerAvatar}>
              <Image 
                source={{ uri: otherUser?.photo }}
                style={styles.headerAvatarImage}
              />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={chat.messages}
          renderItem={({ item }) => <ChatMessage message={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>
                Start the conversation with {otherUser?.name}
              </Text>
            </View>
          }
        />
        
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCreateEvent}
          >
            <Calendar size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.subtext}
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color={!message.trim() ? theme.colors.inactive : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
        
        {/* Event Creation Modal */}
        <Modal
          visible={showEventModal}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Schedule Meetup</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowEventModal(false)}
                >
                  <X size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <Input
                label="Title"
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholder="Coffee Chat"
              />
              
              <View style={styles.dateTimeContainer}>
                <Input
                  label="Date"
                  value={eventDate}
                  onChangeText={setEventDate}
                  placeholder={formattedDate}
                  style={styles.dateInput}
                />
                
                <Input
                  label="Time"
                  value={eventTime}
                  onChangeText={setEventTime}
                  placeholder="14:30"
                  style={styles.timeInput}
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={styles.inputIcon}>
                  <Clock size={18} color={theme.colors.subtext} />
                </View>
                <Input
                  label="Duration (minutes)"
                  value={eventDuration}
                  onChangeText={setEventDuration}
                  keyboardType="numeric"
                  placeholder="60"
                  style={styles.durationInput}
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={styles.inputIcon}>
                  <MapPin size={18} color={theme.colors.subtext} />
                </View>
                <Input
                  label="Location (optional)"
                  value={eventLocation}
                  onChangeText={setEventLocation}
                  placeholder="Blue Bottle Coffee, Market St"
                />
              </View>
              
              <Button
                title="Schedule Meetup"
                onPress={handleSaveEvent}
                fullWidth
                style={styles.scheduleButton}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: theme.spacing.md,
  },
  headerButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  headerAvatar: {
    marginRight: theme.spacing.md,
  },
  headerAvatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  messagesList: {
    padding: theme.spacing.md,
  },
  actionBar: {
    flexDirection: 'row',
    padding: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    maxHeight: 100,
    color: theme.colors.text,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.md,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.card,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    textAlign: 'center',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    ...theme.typography.h2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    ...theme.typography.h2,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 3,
    marginRight: theme.spacing.sm,
  },
  timeInput: {
    flex: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  durationInput: {
    flex: 1,
  },
  scheduleButton: {
    marginTop: theme.spacing.lg,
  },
});