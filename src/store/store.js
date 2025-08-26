import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import budgetsReducer from './slices/budgetsSlice';
import goalsReducer from './slices/goalsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    goals: goalsReducer,
    ui: uiReducer,
  },
});
