import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  ProgressBar, 
  Alert 
} from 'react-bootstrap';
import { format } from 'date-fns';
import { 
  setShowAddTransactionModal, 
  setShowAddBudgetModal, 
  setShowAddGoalModal 
} from '../store/slices/uiSlice';
import { loadTransactions } from '../store/slices/transactionsSlice';
import { loadBudgets } from '../store/slices/budgetsSlice';
import { loadGoals } from '../store/slices/goalsSlice';
import AddTransactionModal from './modals/AddTransactionModal';
import AddBudgetModal from './modals/AddBudgetModal';
import AddGoalModal from './modals/AddGoalModal';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: transactions } = useSelector(state => state.transactions);
  const { items: budgets } = useSelector(state => state.budgets);
  const { items: goals } = useSelector(state => state.goals);
  const { 
    showAddTransactionModal, 
    showAddBudgetModal, 
    showAddGoalModal 
  } = useSelector(state => state.ui);

  const [monthlyStats, setMonthlyStats] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });

  useEffect(() => {
    // Load data if not already loaded
    if (transactions.length === 0) dispatch(loadTransactions());
    if (budgets.length === 0) dispatch(loadBudgets());
    if (goals.length === 0) dispatch(loadGoals());
  }, [dispatch, transactions.length, budgets.length, goals.length]);

  useEffect(() => {
    // Calculate monthly statistics
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    setMonthlyStats({
      income,
      expenses,
      balance: income - expenses
    });
  }, [transactions]);

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const getBudgetProgress = () => {
    return budgets.map(budget => ({
      ...budget,
      percentage: Math.min((budget.spent / budget.limit) * 100, 100),
      remaining: budget.limit - budget.spent
    }));
  };

  const getGoalProgress = () => {
    return goals.map(goal => ({
      ...goal,
      percentage: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100),
      remaining: goal.targetAmount - goal.currentAmount
    }));
  };

  return (
    <div>
      <h1 className="mb-4">Financial Dashboard</h1>
      
      {/* Monthly Overview */}
      <Row className="mb-4">
        <Col md={4}>
          <div className="stats-card text-center">
            <h3>${monthlyStats.income.toFixed(2)}</h3>
            <p>Monthly Income</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card text-center">
            <h3>${monthlyStats.expenses.toFixed(2)}</h3>
            <p>Monthly Expenses</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card text-center">
            <h3 className={monthlyStats.balance >= 0 ? 'text-success' : 'text-danger'}>
              ${monthlyStats.balance.toFixed(2)}
            </h3>
            <p>Monthly Balance</p>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="primary" 
                className="me-2"
                onClick={() => dispatch(setShowAddTransactionModal(true))}
              >
                + Add Transaction
              </Button>
              <Button 
                variant="success" 
                className="me-2"
                onClick={() => dispatch(setShowAddBudgetModal(true))}
              >
                + Add Budget
              </Button>
              <Button 
                variant="info"
                onClick={() => dispatch(setShowAddGoalModal(true))}
              >
                + Add Goal
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Transactions */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Transactions</h5>
            </Card.Header>
            <Card.Body>
              {getRecentTransactions().length > 0 ? (
                getRecentTransactions().map(transaction => (
                  <div key={transaction.id} className="d-flex justify-content-between align-items-center mb-2 p-2 transaction-item">
                    <div>
                      <strong>{transaction.description}</strong>
                      <br />
                      <small className="text-muted">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')} • {transaction.category}
                      </small>
                    </div>
                    <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <Alert variant="info">No transactions yet. Add your first transaction!</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Budget Progress */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Budget Progress</h5>
            </Card.Header>
            <Card.Body>
              {getBudgetProgress().map(budget => (
                <div key={budget.id} className="budget-progress">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{budget.name}</span>
                    <span>${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</span>
                  </div>
                  <ProgressBar 
                    variant={budget.percentage > 90 ? 'danger' : budget.percentage > 75 ? 'warning' : 'success'}
                    now={budget.percentage} 
                    label={`${budget.percentage.toFixed(1)}%`}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Financial Goals */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Financial Goals</h5>
            </Card.Header>
            <Card.Body>
              {getGoalProgress().map(goal => (
                <div key={goal.id} className="goal-progress">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{goal.name}</span>
                    <span>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <ProgressBar 
                    variant="info"
                    now={goal.percentage} 
                    label={`${goal.percentage.toFixed(1)}%`}
                  />
                  <small className="text-muted">
                    Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                  </small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <AddTransactionModal 
        show={showAddTransactionModal}
        onHide={() => dispatch(setShowAddTransactionModal(false))}
      />
      <AddBudgetModal 
        show={showAddBudgetModal}
        onHide={() => dispatch(setShowAddBudgetModal(false))}
      />
      <AddGoalModal 
        show={showAddGoalModal}
        onHide={() => dispatch(setShowAddGoalModal(false))}
      />
    </div>
  );
};

export default Dashboard;
