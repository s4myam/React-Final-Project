import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for loading transactions from localStorage
export const loadTransactions = createAsyncThunk(
  'transactions/loadTransactions',
  async () => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addTransaction: (state, action) => {
      state.items.push(action.payload);
      localStorage.setItem('transactions', JSON.stringify(state.items));
    },
    updateTransaction: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        localStorage.setItem('transactions', JSON.stringify(state.items));
      }
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('transactions', JSON.stringify(state.items));
    },
    clearTransactions: (state) => {
      state.items = [];
      localStorage.removeItem('transactions');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addTransaction, updateTransaction, deleteTransaction, clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
