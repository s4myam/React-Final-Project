import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showAddTransactionModal: false,
    showAddBudgetModal: false,
    showAddGoalModal: false,
    showEditModal: false,
    editingItem: null,
    filterType: 'all', // all, income, expense
    filterCategory: 'all',
    sortBy: 'date', // date, amount, category
    sortOrder: 'desc', // asc, desc
  },
  reducers: {
    setShowAddTransactionModal: (state, action) => {
      state.showAddTransactionModal = action.payload;
    },
    setShowAddBudgetModal: (state, action) => {
      state.showAddBudgetModal = action.payload;
    },
    setShowAddGoalModal: (state, action) => {
      state.showAddGoalModal = action.payload;
    },
    setShowEditModal: (state, action) => {
      state.showEditModal = action.payload;
    },
    setEditingItem: (state, action) => {
      state.editingItem = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      state.filterType = 'all';
      state.filterCategory = 'all';
      state.sortBy = 'date';
      state.sortOrder = 'desc';
    },
  },
});

export const {
  setShowAddTransactionModal,
  setShowAddBudgetModal,
  setShowAddGoalModal,
  setShowEditModal,
  setEditingItem,
  setFilterType,
  setFilterCategory,
  setSortBy,
  setSortOrder,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
