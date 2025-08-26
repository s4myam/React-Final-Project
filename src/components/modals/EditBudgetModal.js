import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Modal, 
  Button, 
  Form, 
  Row, 
  Col,
  Alert
} from 'react-bootstrap';
import { updateBudget } from '../../store/slices/budgetsSlice';

const EditBudgetModal = ({ show, onHide, budget }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    color: '#667eea'
  });

  const [errors, setErrors] = useState({});

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  useEffect(() => {
    if (budget && show) {
      setFormData({
        name: budget.name,
        limit: budget.limit.toString(),
        color: budget.color
      });
      setErrors({});
    }
  }, [budget, show]);

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
      newErrors.name = 'Budget name is required';
    }
    
    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      newErrors.limit = 'Budget limit must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedBudget = {
      ...budget,
      name: formData.name.trim(),
      limit: parseFloat(formData.limit),
      color: formData.color
    };

    dispatch(updateBudget(updatedBudget));
    onHide();
  };

  if (!budget) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Budget Category</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Budget Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              isInvalid={!!errors.name}
              placeholder="e.g., Food & Dining"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Monthly Limit *</Form.Label>
            <Form.Control
              type="number"
              name="limit"
              value={formData.limit}
              onChange={handleInputChange}
              isInvalid={!!errors.limit}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <Form.Control.Feedback type="invalid">
              {errors.limit}
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

          <Alert variant="info">
            <strong>Current Spending:</strong> ${budget.spent.toFixed(2)}<br />
            <small>Note: Changing the budget limit will not affect the current spending amount.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Update Budget
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditBudgetModal;
