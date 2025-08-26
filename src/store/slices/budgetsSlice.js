import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadBudgets = createAsyncThunk(
  'budgets/loadBudgets',
  async () => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : [
      { id: '1', name: 'Food & Dining', limit: 500, spent: 0, color: '#FF6B6B' },
      { id: '2', name: 'Transportation', limit: 300, spent: 0, color: '#4ECDC4' },
      { id: '3', name: 'Entertainment', limit: 200, spent: 0, color: '#45B7D1' },
      { id: '4', name: 'Shopping', limit: 400, spent: 0, color: '#96CEB4' },
      { id: '5', name: 'Utilities', limit: 250, spent: 0, color: '#FFEAA7' },
    ];
  }
);

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addBudget: (state, action) => {
      state.items.push(action.payload);
      localStorage.setItem('budgets', JSON.stringify(state.items));
    },
    updateBudget: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        localStorage.setItem('budgets', JSON.stringify(state.items));
      }
    },
    deleteBudget: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('budgets', JSON.stringify(state.items));
    },
    updateBudgetSpent: (state, action) => {
      const { categoryId, amount } = action.payload;
      const budget = state.items.find(item => item.id === categoryId);
      if (budget) {
        budget.spent += amount;
        localStorage.setItem('budgets', JSON.stringify(state.items));
      }
    },
    resetBudgetSpent: (state, action) => {
      const categoryId = action.payload;
      const budget = state.items.find(item => item.id === categoryId);
      if (budget) {
        budget.spent = 0;
        localStorage.setItem('budgets', JSON.stringify(state.items));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBudgets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadBudgets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadBudgets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { 
  addBudget, 
  updateBudget, 
  deleteBudget, 
  updateBudgetSpent, 
  resetBudgetSpent 
} = budgetsSlice.actions;
export default budgetsSlice.reducer;
