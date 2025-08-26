import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Modal, 
  Button, 
  Form, 
  Row, 
  Col 
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { addGoal } from '../../store/slices/goalsSlice';

const AddGoalModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    color: '#667eea'
  });

  const [errors, setErrors] = useState({});

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  useEffect(() => {
    if (show) {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: nextYear.toISOString().split('T')[0],
        color: '#667eea'
      });
      setErrors({});
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }
    
    if (parseFloat(formData.currentAmount) < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative';
    }
    
    if (parseFloat(formData.currentAmount) > parseFloat(formData.targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }
    
    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    }
    
    const targetDate = new Date(formData.targetDate);
    const today = new Date();
    if (targetDate <= today) {
      newErrors.targetDate = 'Target date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const goal = {
      id: uuidv4(),
      name: formData.name.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      targetDate: formData.targetDate,
      color: formData.color
    };

    dispatch(addGoal(goal));
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Financial Goal</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Goal Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              isInvalid={!!errors.name}
              placeholder="e.g., Emergency Fund, Vacation Fund"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Target Amount *</Form.Label>
                <Form.Control
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  isInvalid={!!errors.targetAmount}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.targetAmount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Current Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleInputChange}
                  isInvalid={!!errors.currentAmount}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentAmount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Target Date *</Form.Label>
            <Form.Control
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleInputChange}
              isInvalid={!!errors.targetDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.targetDate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Color Theme</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <div
                  key={color}
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: formData.color === color ? '3px solid #333' : '2px solid #ddd'
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  title={color}
                />
              ))}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Goal
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddGoalModal;
