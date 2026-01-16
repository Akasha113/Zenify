import { UserProfile, JournalEntry, Conversation, Mood, MoodEntry, FlaggedContent, ChatMessage } from '../types';
import { checkContent } from './contentMonitor';

// Default user profile
const defaultProfile: UserProfile = {
  name: '',
  isAdmin: false,
  mood: {
    current: 'neutral',
    history: [],
  },
  journals: [],
  conversations: [],
  settings: {
    theme: 'light',
    notifications: false,
    fontSize: 'medium',
  },
};

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'MindFul Journal_user_profile',
  JOURNALS: 'MindFul Journal_journals',
  MOOD_ENTRIES: 'MindFul Journal_mood_entries',
  CONVERSATIONS: 'MindFul Journal_conversations',
  FLAGGED_CONTENT: 'MindFul Journal_flagged_content',
};

// Initialize storage
export const initializeStorage = (): UserProfile => {
  const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  
  if (!storedProfile) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  
  return JSON.parse(storedProfile);
};

// User profile
export const getUserProfile = (): UserProfile => {
  const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return storedProfile ? JSON.parse(storedProfile) : initializeStorage();
};

export const updateUserProfile = (profile: Partial<UserProfile>): UserProfile => {
  const currentProfile = getUserProfile();
  const updatedProfile = { ...currentProfile, ...profile };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
  return updatedProfile;
};

// Mood entries
export const getMoodEntries = (): MoodEntry[] => {
  const profile = getUserProfile();
  return profile.mood.history;
};

// Add new mood entry
export const addMoodEntry = (mood: Mood, note: string = ''): MoodEntry => {
  const profile = getUserProfile();
  const newEntry: MoodEntry = {
    id: Date.now().toString(),
    mood,
    note,
    date: new Date().toISOString(), // ✅ fixed date
  };

  const updatedHistory = [...profile.mood.history, newEntry];
  updateUserProfile({
    mood: {
      current: mood,
      history: updatedHistory,
    },
  });

  return newEntry;
};

// Update existing mood entry
export const updateMoodEntry = (id: string, updates: Partial<Pick<MoodEntry, 'mood' | 'note'>>): MoodEntry | null => {
  const profile = getUserProfile();
  const index = profile.mood.history.findIndex(entry => entry.id === id);
  if (index === -1) return null;

  const updatedEntry: MoodEntry = {
    ...profile.mood.history[index],
    ...updates,
    date: new Date().toISOString(), // update date
  };

  const updatedHistory = [...profile.mood.history];
  updatedHistory[index] = updatedEntry;

  updateUserProfile({
    mood: {
      current: updatedEntry.mood,
      history: updatedHistory,
    },
  });

  return updatedEntry;
};

// Journal entries
export const getJournalEntries = (): JournalEntry[] => {
  const profile = getUserProfile();
  return profile.journals;
};

export const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): JournalEntry => {
  const profile = getUserProfile();
  const contentCheck = checkContent(entry.content);

  const newEntry: JournalEntry = {
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...entry,
    flagged: contentCheck.flagged,
    flagReason: contentCheck.reason,
  };

  const updatedJournals = [...profile.journals, newEntry];
  updateUserProfile({ journals: updatedJournals });

  return newEntry;
};

export const updateJournalEntry = (id: string, updates: Omit<JournalEntry, 'id' | 'createdAt'>): JournalEntry | null => {
  const profile = getUserProfile();
  const index = profile.journals.findIndex(journal => journal.id === id);
  if (index === -1) return null;

  const contentCheck = checkContent(updates.content);

  const updatedEntry: JournalEntry = {
    ...profile.journals[index],
    ...updates,
    updatedAt: Date.now(),
    flagged: contentCheck.flagged,
    flagReason: contentCheck.reason,
  };

  const updatedJournals = [...profile.journals];
  updatedJournals[index] = updatedEntry;
  updateUserProfile({ journals: updatedJournals });

  return updatedEntry;
};

export const deleteJournalEntry = (id: string): boolean => {
  const profile = getUserProfile();
  const updatedJournals = profile.journals.filter(journal => journal.id !== id);
  if (updatedJournals.length === profile.journals.length) return false;

  updateUserProfile({ journals: updatedJournals });
  return true;
};

// Conversations and flagged content (unchanged)
export const getConversations = (): Conversation[] => getUserProfile().conversations;
export const getConversation = (id: string): Conversation | null => getUserProfile().conversations.find(c => c.id === id) || null;
export const createConversation = (title: string): Conversation => {
  const profile = getUserProfile();
  const newConversation: Conversation = {
    id: Date.now().toString(),
    title,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    hasFlaggedContent: false,
  };
  const updatedConversations = [...profile.conversations, newConversation];
  updateUserProfile({ conversations: updatedConversations });
  return newConversation;
};
export const updateConversation = (id: string, updates: Partial<Conversation>): Conversation | null => {
  const profile = getUserProfile();
  const index = profile.conversations.findIndex(c => c.id === id);
  if (index === -1) return null;

  const updatedConvo = { ...profile.conversations[index], ...updates, updatedAt: Date.now() };
  const updatedConversations = [...profile.conversations];
  updatedConversations[index] = updatedConvo;
  updateUserProfile({ conversations: updatedConversations });
  return updatedConvo;
};
export const deleteConversation = (id: string): boolean => {
  const profile = getUserProfile();
  const updatedConversations = profile.conversations.filter(c => c.id !== id);
  if (updatedConversations.length === profile.conversations.length) return false;
  updateUserProfile({ conversations: updatedConversations });
  return true;
};

export const addMessageToConversation = (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Conversation | null => {
  const profile = getUserProfile();
  const index = profile.conversations.findIndex(c => c.id === conversationId);
  if (index === -1) return null;

  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    ...message,
  };

  const updatedConvo = {
    ...profile.conversations[index],
    messages: [...profile.conversations[index].messages, newMessage],
    updatedAt: Date.now(),
  };

  const updatedConversations = [...profile.conversations];
  updatedConversations[index] = updatedConvo;
  updateUserProfile({ conversations: updatedConversations });
  return updatedConvo;
};

export const getFlaggedContent = (): FlaggedContent[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.FLAGGED_CONTENT);
  return stored ? JSON.parse(stored) : [];
};
export const addFlaggedContent = (content: Omit<FlaggedContent, 'id' | 'timestamp'>): FlaggedContent => {
  const flaggedContent = getFlaggedContent();
  const newEntry: FlaggedContent = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    ...content,
    riskLevel: content.riskLevel || 'low',
  };
  const updated = [...flaggedContent, newEntry];
  localStorage.setItem(STORAGE_KEYS.FLAGGED_CONTENT, JSON.stringify(updated));
  return newEntry;
};
export const updateFlaggedContent = (id: string, updates: Partial<FlaggedContent>): FlaggedContent | null => {
  const flaggedContent = getFlaggedContent();
  const index = flaggedContent.findIndex(item => item.id === id);
  if (index === -1) return null;
  const updatedItem = { ...flaggedContent[index], ...updates };
  flaggedContent[index] = updatedItem;
  localStorage.setItem(STORAGE_KEYS.FLAGGED_CONTENT, JSON.stringify(flaggedContent));
  return updatedItem;
};

// Export storage
export const storage = {
  initializeStorage,
  getUserProfile,
  updateUserProfile,
  getMoodEntries,
  addMoodEntry,
  updateMoodEntry,
  getJournalEntries,
  addJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  addMessageToConversation,
  getFlaggedContent,
  addFlaggedContent,
  updateFlaggedContent,
};

export default storage;
