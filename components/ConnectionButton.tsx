import React from 'react';
import { StyleSheet } from 'react-native';
import Button from './Button';
import { useConnectionStore } from '@/store/connectionStore';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'expo-router';

interface ConnectionButtonProps {
  userId: string;
}

export default function ConnectionButton({ userId }: ConnectionButtonProps) {
  const router = useRouter();
  const { 
    isConnected, 
    isPending, 
    hasReceivedRequest,
    sendConnectionRequest,
    acceptConnectionRequest,
  } = useConnectionStore();
  const { createChat } = useChatStore();
  
  const connected = isConnected(userId);
  const pending = isPending(userId);
  const received = hasReceivedRequest(userId);
  
  const handleConnect = () => {
    if (received) {
      acceptConnectionRequest(userId);
    } else {
      sendConnectionRequest(userId);
    }
  };
  
  const handleMessage = () => {
    const chatId = createChat(userId);
    router.push(`/chat/${chatId}`);
  };
  
  if (connected) {
    return (
      <Button
        title="Message"
        onPress={handleMessage}
        variant="primary"
        fullWidth
      />
    );
  }
  
  if (pending) {
    return (
      <Button
        title="Request Sent"
        onPress={() => {}}
        variant="outline"
        disabled
        fullWidth
      />
    );
  }
  
  if (received) {
    return (
      <Button
        title="Accept Request"
        onPress={handleConnect}
        variant="primary"
        fullWidth
      />
    );
  }
  
  return (
    <Button
      title="Connect"
      onPress={handleConnect}
      variant="primary"
      fullWidth
    />
  );
}

const styles = StyleSheet.create({});