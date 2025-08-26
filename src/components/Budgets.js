import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  ProgressBar, 
  Alert,
  Modal,
  Form,
  Badge
} from 'react-bootstrap';
import { 
  setShowAddBudgetModal, 
  setShowEditModal, 
  setEditingItem 
} from '../store/slices/uiSlice';
import { deleteBudget, updateBudget, resetBudgetSpent } from '../store/slices/budgetsSlice';
import AddBudgetModal from './modals/AddBudgetModal';
import EditBudgetModal from './modals/EditBudgetModal';

const Budgets = () => {
  const dispatch = useDispatch();
  const { items: budgets } = useSelector(state => state.budgets);
  const { showAddBudgetModal, showEditModal, editingItem } = useSelector(state => state.ui);

  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleEdit = (budget) => {
    dispatch(setEditingItem(budget));
    dispatch(setShowEditModal(true));
  };

  const handleDelete = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget category? This will also remove all associated spending data.')) {
      dispatch(deleteBudget(budgetId));
    }
  };

  const handleReset = (budget) => {
    setSelectedBudget(budget);
    setShowResetModal(true);
  };

  const confirmReset = () => {
    if (selectedBudget) {
      dispatch(resetBudgetSpent(selectedBudget.id));
      setShowResetModal(false);
      setSelectedBudget(null);
    }
  };

  const getTotalBudget = () => {
    return budgets.reduce((sum, budget) => sum + budget.limit, 0);
  };

  const getTotalSpent = () => {
    return budgets.reduce((sum, budget) => sum + budget.spent, 0);
  };

  const getTotalRemaining = () => {
    return getTotalBudget() - getTotalSpent();
  };

  const getBudgetProgress = () => {
    return budgets.map(budget => ({
      ...budget,
      percentage: Math.min((budget.spent / budget.limit) * 100, 100),
      remaining: budget.limit - budget.spent,
      status: budget.spent > budget.limit ? 'over' : 
              budget.spent > budget.limit * 0.9 ? 'warning' : 'good'
    }));
  };

  const budgetProgress = getBudgetProgress();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Budget Management</h1>
        <Button 
          variant="primary"
          onClick={() => dispatch(setShowAddBudgetModal(true))}
        >
          + Add Budget Category
        </Button>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>${getTotalBudget().toFixed(2)}</h3>
            <p>Total Budget</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>${getTotalSpent().toFixed(2)}</h3>
            <p>Total Spent</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3 className={getTotalRemaining() >= 0 ? 'text-success' : 'text-danger'}>
              ${getTotalRemaining().toFixed(2)}
            </h3>
            <p>Remaining</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>{budgets.length}</h3>
            <p>Categories</p>
          </div>
        </Col>
      </Row>

      {/* Budget Categories */}
      {budgetProgress.length > 0 ? (
        <Row>
          {budgetProgress.map(budget => (
            <Col lg={6} key={budget.id} className="mb-4">
              <Card>
                <Card.Header 
                  style={{ 
                    backgroundColor: budget.color,
                    color: 'white'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{budget.name}</h5>
                    <div>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(budget)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={() => handleReset(budget)}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Progress</span>
                      <span>
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                    </div>
                    <ProgressBar 
                      variant={
                        budget.status === 'over' ? 'danger' : 
                        budget.status === 'warning' ? 'warning' : 'success'
                      }
                      now={budget.percentage} 
                      label={`${budget.percentage.toFixed(1)}%`}
                    />
                  </div>

                  <div className="row text-center">
                    <div className="col-4">
                      <div className="border-end">
                        <h6 className="text-muted mb-1">Limit</h6>
                        <strong>${budget.limit.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="border-end">
                        <h6 className="text-muted mb-1">Spent</h6>
                        <strong className={budget.spent > budget.limit ? 'text-danger' : ''}>
                          ${budget.spent.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <h6 className="text-muted mb-1">Remaining</h6>
                      <strong className={budget.remaining < 0 ? 'text-danger' : 'text-success'}>
                        ${budget.remaining.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {budget.spent > budget.limit && (
                    <Alert variant="danger" className="mt-3 mb-0">
                      <strong>Budget Exceeded!</strong> You've spent ${(budget.spent - budget.limit).toFixed(2)} more than your limit.
                    </Alert>
                  )}

                  {budget.spent > budget.limit * 0.9 && budget.spent <= budget.limit && (
                    <Alert variant="warning" className="mt-3 mb-0">
                      <strong>Warning!</strong> You're approaching your budget limit.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          No budget categories yet. Add your first budget category to start tracking your spending!
        </Alert>
      )}

      {/* Reset Confirmation Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Budget Spending</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to reset the spending for <strong>{selectedBudget?.name}</strong>?
          </p>
          <p className="text-muted">
            This will set the current spending amount back to $0.00. This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={confirmReset}>
            Reset Spending
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Modals */}
      <AddBudgetModal 
        show={showAddBudgetModal}
        onHide={() => dispatch(setShowAddBudgetModal(false))}
      />
      <EditBudgetModal 
        show={showEditModal}
        onHide={() => dispatch(setShowEditModal(false))}
        budget={editingItem}
      />
    </div>
  );
};

export default Budgets;
