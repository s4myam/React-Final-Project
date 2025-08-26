import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadGoals = createAsyncThunk(
  'goals/loadGoals',
  async () => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [
      { 
        id: '1', 
        name: 'Emergency Fund', 
        targetAmount: 5000, 
        currentAmount: 1200, 
        targetDate: '2024-12-31',
        color: '#FF6B6B' 
      },
      { 
        id: '2', 
        name: 'Vacation Fund', 
        targetAmount: 3000, 
        currentAmount: 800, 
        targetDate: '2024-06-30',
        color: '#4ECDC4' 
      },
    ];
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addGoal: (state, action) => {
      state.items.push(action.payload);
      localStorage.setItem('goals', JSON.stringify(state.items));
    },
    updateGoal: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        localStorage.setItem('goals', JSON.stringify(state.items));
      }
    },
    deleteGoal: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('goals', JSON.stringify(state.items));
    },
    updateGoalProgress: (state, action) => {
      const { id, amount } = action.payload;
      const goal = state.items.find(item => item.id === id);
      if (goal) {
        goal.currentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        localStorage.setItem('goals', JSON.stringify(state.items));
      }
    },
    resetGoalProgress: (state, action) => {
      const id = action.payload;
      const goal = state.items.find(item => item.id === id);
      if (goal) {
        goal.currentAmount = 0;
        localStorage.setItem('goals', JSON.stringify(state.items));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { 
  addGoal, 
  updateGoal, 
  deleteGoal, 
  updateGoalProgress, 
  resetGoalProgress 
} = goalsSlice.actions;
export default goalsSlice.reducer;
