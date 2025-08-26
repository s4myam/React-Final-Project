import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { loadTransactions } from './store/slices/transactionsSlice';
import { loadBudgets } from './store/slices/budgetsSlice';
import { loadGoals } from './store/slices/goalsSlice';

import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Goals from './components/Goals';
import Reports from './components/Reports';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load initial data from localStorage
    dispatch(loadTransactions());
    dispatch(loadBudgets());
    dispatch(loadGoals());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Container fluid className="py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
