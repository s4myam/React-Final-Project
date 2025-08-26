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
import { format } from 'date-fns';
import {
  setShowAddGoalModal,
  setShowEditModal,
  setEditingItem
} from '../store/slices/uiSlice';
import { deleteGoal, updateGoal, updateGoalProgress, resetGoalProgress } from '../store/slices/goalsSlice';
import AddGoalModal from './modals/AddGoalModal.jsx';
import EditGoalModal from './modals/EditGoalModal.jsx';

const Goals = () => {
  const dispatch = useDispatch();
  const { items: goals } = useSelector(state => state.goals);
  const { showAddGoalModal, showEditModal, editingItem } = useSelector(state => state.ui);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');

  const handleEdit = (goal) => {
    dispatch(setEditingItem(goal));
    dispatch(setShowEditModal(true));
  };

  const handleDelete = (goalId) => {
    if (window.confirm('Are you sure you want to delete this financial goal? This will also remove all progress data.')) {
      dispatch(deleteGoal(goalId));
    }
  };

  const handleUpdateProgress = (goal) => {
    setSelectedGoal(goal);
    setProgressAmount('');
    setShowProgressModal(true);
  };

  const handleResetProgress = (goal) => {
    setSelectedGoal(goal);
    setShowResetModal(true);
  };

  const confirmUpdateProgress = () => {
    if (selectedGoal && progressAmount) {
      const amount = parseFloat(progressAmount);
      if (amount > 0) {
        dispatch(updateGoalProgress({
          id: selectedGoal.id,
          amount: amount
        }));
        setShowProgressModal(false);
        setSelectedGoal(null);
        setProgressAmount('');
      }
    }
  };

  const confirmResetProgress = () => {
    if (selectedGoal) {
      dispatch(resetGoalProgress(selectedGoal.id));
      setShowResetModal(false);
      setSelectedGoal(null);
    }
  };

  const getTotalTargetAmount = () => {
    return goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  };

  const getTotalCurrentAmount = () => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  };

  const getTotalRemaining = () => {
    return getTotalTargetAmount() - getTotalCurrentAmount();
  };

  const getGoalProgress = () => {
    return goals.map(goal => ({
      ...goal,
      percentage: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100),
      remaining: goal.targetAmount - goal.currentAmount,
      daysRemaining: Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)),
      status: goal.currentAmount >= goal.targetAmount ? 'completed' :
        goal.daysRemaining < 0 ? 'overdue' : 'active'
    }));
  };

  const goalProgress = getGoalProgress();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Financial Goals</h1>
        <Button
          variant="primary"
          onClick={() => dispatch(setShowAddGoalModal(true))}
        >
          + Add Financial Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>${getTotalTargetAmount().toFixed(2)}</h3>
            <p>Total Target</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>${getTotalCurrentAmount().toFixed(2)}</h3>
            <p>Total Saved</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3 className={getTotalRemaining() >= 0 ? 'text-info' : 'text-success'}>
              ${getTotalRemaining().toFixed(2)}
            </h3>
            <p>Remaining</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>{goals.length}</h3>
            <p>Active Goals</p>
          </div>
        </Col>
      </Row>

      {/* Financial Goals */}
      {goalProgress.length > 0 ? (
        <Row>
          {goalProgress.map(goal => (
            <Col lg={6} key={goal.id} className="mb-4">
              <Card>
                <Card.Header
                  style={{
                    backgroundColor: goal.color,
                    color: 'white'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{goal.name}</h5>
                    <div>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(goal)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={() => handleUpdateProgress(goal)}
                      >
                        Update Progress
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={() => handleResetProgress(goal)}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
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
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <ProgressBar
                      variant={
                        goal.status === 'completed' ? 'success' :
                          goal.status === 'overdue' ? 'danger' : 'info'
                      }
                      now={goal.percentage}
                      label={`${goal.percentage.toFixed(1)}%`}
                    />
                  </div>

                  <div className="row text-center mb-3">
                    <div className="col-4">
                      <div className="border-end">
                        <h6 className="text-muted mb-1">Target</h6>
                        <strong>${goal.targetAmount.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="border-end">
                        <h6 className="text-muted mb-1">Saved</h6>
                        <strong>${goal.currentAmount.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <h6 className="text-muted mb-1">Remaining</h6>
                      <strong className={goal.remaining <= 0 ? 'text-success' : 'text-info'}>
                        ${goal.remaining.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  <div className="text-center mb-3">
                    <Badge
                      bg={goal.status === 'completed' ? 'success' :
                        goal.status === 'overdue' ? 'danger' : 'info'}
                      className="mb-2"
                    >
                      {goal.status === 'completed' ? 'Goal Achieved!' :
                        goal.status === 'overdue' ? 'Overdue' : 'Active'}
                    </Badge>
                    <br />
                    <small className="text-muted">
                      Target Date: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                    </small>
                    {goal.daysRemaining > 0 && (
                      <>
                        <br />
                        <small className="text-muted">
                          {goal.daysRemaining} days remaining
                        </small>
                      </>
                    )}
                    {goal.daysRemaining < 0 && (
                      <>
                        <br />
                        <small className="text-danger">
                          {Math.abs(goal.daysRemaining)} days overdue
                        </small>
                      </>
                    )}
                  </div>

                  {goal.status === 'completed' && (
                    <Alert variant="success" className="mb-0">
                      <strong>Congratulations!</strong> You've achieved your goal of ${goal.targetAmount.toFixed(2)}!
                    </Alert>
                  )}

                  {goal.status === 'overdue' && (
                    <Alert variant="danger" className="mb-0">
                      <strong>Goal Overdue!</strong> You're {Math.abs(goal.daysRemaining)} days past your target date.
                    </Alert>
                  )}

                  {goal.status === 'active' && goal.daysRemaining < 30 && (
                    <Alert variant="warning" className="mb-0">
                      <strong>Deadline Approaching!</strong> Only {goal.daysRemaining} days left to reach your goal.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          No financial goals yet. Add your first goal to start saving towards your dreams!
        </Alert>
      )}

      {/* Update Progress Modal */}
      <Modal show={showProgressModal} onHide={() => setShowProgressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Goal Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            How much have you saved towards <strong>{selectedGoal?.name}</strong>?
          </p>
          <Form.Group>
            <Form.Label>Amount to Add</Form.Label>
            <Form.Control
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={progressAmount}
              onChange={(e) => setProgressAmount(e.target.value)}
            />
            <Form.Text className="text-muted">
              Current progress: ${selectedGoal?.currentAmount.toFixed(2)} / ${selectedGoal?.targetAmount.toFixed(2)}
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProgressModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmUpdateProgress}>
            Update Progress
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reset Progress Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Goal Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to reset the progress for <strong>{selectedGoal?.name}</strong>?
          </p>
          <p className="text-muted">
            This will set the current saved amount back to $0.00. This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={confirmResetProgress}>
            Reset Progress
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Modals */}
      <AddGoalModal
        show={showAddGoalModal}
        onHide={() => dispatch(setShowAddGoalModal(false))}
      />
      <EditGoalModal
        show={showEditModal}
        onHide={() => dispatch(setShowEditModal(false))}
        goal={editingItem}
      />
    </div>
  );
};

export default Goals;
