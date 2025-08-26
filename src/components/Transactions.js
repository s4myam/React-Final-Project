import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Form, 
  Badge, 
  Alert,
  Modal,
  InputGroup
} from 'react-bootstrap';
import { format } from 'date-fns';
import { 
  setShowAddTransactionModal, 
  setFilterType, 
  setFilterCategory, 
  setSortBy, 
  setSortOrder,
  resetFilters 
} from '../store/slices/uiSlice';
import { deleteTransaction, updateTransaction } from '../store/slices/transactionsSlice';
import { updateBudgetSpent } from '../store/slices/budgetsSlice';
import AddTransactionModal from './modals/AddTransactionModal';
import EditTransactionModal from './modals/EditTransactionModal';

const Transactions = () => {
  const dispatch = useDispatch();
  const { items: transactions } = useSelector(state => state.transactions);
  const { items: budgets } = useSelector(state => state.budgets);
  const { 
    filterType, 
    filterCategory, 
    sortBy, 
    sortOrder,
    showAddTransactionModal 
  } = useSelector(state => state.ui);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'type') {
      dispatch(setFilterType(value));
    } else if (filterName === 'category') {
      dispatch(setFilterCategory(value));
    }
  };

  const handleSortChange = (sortField) => {
    if (sortBy === sortField) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(sortField));
      dispatch(setSortOrder('desc'));
    }
  };

  const getFilteredAndSortedTransactions = () => {
    let filtered = [...transactions];

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDelete = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      // If it's an expense, we need to update the budget spent
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction && transaction.type === 'expense') {
        const budget = budgets.find(b => b.name === transaction.category);
        if (budget) {
          dispatch(updateBudgetSpent({
            categoryId: budget.id,
            amount: -parseFloat(transaction.amount) // Subtract the amount
          }));
        }
      }
      dispatch(deleteTransaction(transactionId));
    }
  };

  const getCategoryOptions = () => {
    const categories = [...new Set(transactions.map(t => t.category))];
    return categories.sort();
  };

  const getTotalAmount = (type) => {
    return getFilteredAndSortedTransactions()
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const filteredTransactions = getFilteredAndSortedTransactions();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Transactions</h1>
        <Button 
          variant="primary"
          onClick={() => dispatch(setShowAddTransactionModal(true))}
        >
          + Add Transaction
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={filterType}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {getCategoryOptions().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>&nbsp;</Form.Label>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    dispatch(resetFilters());
                    setSearchTerm('');
                  }}
                  className="w-100"
                >
                  Reset
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <div className="stats-card text-center">
            <h3>${getTotalAmount('income').toFixed(2)}</h3>
            <p>Total Income</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card text-center">
            <h3>${getTotalAmount('expense').toFixed(2)}</h3>
            <p>Total Expenses</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card text-center">
            <h3 className={getTotalAmount('income') - getTotalAmount('expense') >= 0 ? 'text-success' : 'text-danger'}>
              ${(getTotalAmount('income') - getTotalAmount('expense')).toFixed(2)}
            </h3>
            <p>Net Amount</p>
          </div>
        </Col>
      </Row>

      {/* Transactions Table */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Transaction History</h5>
            <small className="text-muted">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </small>
          </div>
        </Card.Header>
        <Card.Body>
          {filteredTransactions.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSortChange('date')}
                  >
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Description</th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSortChange('category')}
                  >
                    Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSortChange('amount')}
                  >
                    Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Type</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                    <td>{transaction.description}</td>
                    <td>
                      <Badge 
                        bg="secondary"
                        style={{ backgroundColor: budgets.find(b => b.name === transaction.category)?.color }}
                      >
                        {transaction.category}
                      </Badge>
                    </td>
                    <td className={transaction.type === 'income' ? 'text-success' : 'text-danger'}>
                      <strong>
                        {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <Badge bg={transaction.type === 'income' ? 'success' : 'danger'}>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td>
                      {transaction.notes && (
                        <small className="text-muted">{transaction.notes}</small>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(transaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
                ? 'No transactions match your current filters.' 
                : 'No transactions yet. Add your first transaction!'}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddTransactionModal 
        show={showAddTransactionModal}
        onHide={() => dispatch(setShowAddTransactionModal(false))}
      />
      <EditTransactionModal 
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
