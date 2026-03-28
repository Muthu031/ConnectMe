import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message } from '../../types';

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action: PayloadAction<{ messageId: string; status: string }>) => {
      const message = state.messages.find(m => m._id === action.payload.messageId);
      if (message) {
        message.status = action.payload.status as any;
      }
    },
  },
});

export const {
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
