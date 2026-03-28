import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  viewingUser: User | null;
  searchResults: User[];
  isLoading: boolean;
}

const initialState: UserState = {
  viewingUser: null,
  searchResults: [],
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setViewingUser: (state, action: PayloadAction<User | null>) => {
      state.viewingUser = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<User[]>) => {
      state.searchResults = action.payload;
    },
  },
});

export const { setViewingUser, setSearchResults } = userSlice.actions;
export default userSlice.reducer;
