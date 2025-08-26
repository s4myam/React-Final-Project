import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Modal, 
  Button, 
  Form, 
  Row, 
  Col 
} from 'react-bootstrap';
import { updateTransaction } from '../../store/slices/transactionsSlice';
import { updateBudgetSpent } from '../../store/slices/budgetsSlice';

const EditTransactionModal = ({ show, onHide, transaction }) => {
  const dispatch = useDispatch();
  const budgets = useSelector(state => state.budgets.items);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [originalAmount, setOriginalAmount] = useState(0);

  useEffect(() => {
    if (transaction && show) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        notes: transaction.notes || ''
      });
      setOriginalAmount(parseFloat(transaction.amount));
      setErrors({});
    }
  }, [transaction, show]);

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
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedTransaction = {
      ...transaction,
      ...formData,
      amount: parseFloat(formData.amount).toFixed(2),
      updatedAt: new Date().toISOString()
    };

    dispatch(updateTransaction(updatedTransaction));

    // Update budget spent if it's an expense and amount changed
    if (formData.type === 'expense' && formData.category) {
      const budget = budgets.find(b => b.name === formData.category);
      if (budget) {
        const amountDifference = parseFloat(formData.amount) - originalAmount;
        if (amountDifference !== 0) {
          dispatch(updateBudgetSpent({
            categoryId: budget.id,
            amount: amountDifference
          }));
        }
      }
    }

    onHide();
  };

  const getCategoryOptions = () => {
    if (formData.type === 'income') {
      return [
        'Salary',
        'Freelance',
        'Investment',
        'Gift',
        'Other Income'
      ];
    } else {
      return budgets.map(budget => budget.name);
    }
  };

  if (!transaction) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Transaction</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  isInvalid={!!errors.description}
                  placeholder="Enter transaction description"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Amount *</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  isInvalid={!!errors.amount}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type *</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  isInvalid={!!errors.category}
                >
                  <option value="">Select category</option>
                  {getCategoryOptions().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  isInvalid={!!errors.date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Optional notes"
                  rows={1}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Update Transaction
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditTransactionModal;
