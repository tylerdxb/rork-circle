export interface User {
  id: string;
  name: string;
  photo: string;
  headline: string;
  location: string;
  bio: string;
  interests: string[];
  intents: string[];
  prompts: UserPrompt[];
  verified: boolean;
}

export interface UserPrompt {
  promptId: string;
  answer: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Intent {
  id: string;
  name: string;
}

export interface Prompt {
  id: string;
  text: string;
}

export interface City {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
}

export interface UserConnections {
  userId: string;
  connections: string[]; // Accepted connections
  pending: string[]; // Sent requests
  received: string[]; // Received requests
}

export interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userId: string | null;
  inviteCode: string | null;
}

export interface ProfileFormData {
  photo: string;
  name: string;
  headline: string;
  location: string;
  bio: string;
  interests: string[];
  intents: string[];
  prompts: UserPrompt[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  location?: string;
  description?: string;
  participantId: string; // ID of the other user
  chatId: string; // ID of the chat where this event was created
}