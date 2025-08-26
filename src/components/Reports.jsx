import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Form, 
  Table,
  Badge
} from 'react-bootstrap';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { items: transactions } = useSelector(state => state.transactions);
  const { items: budgets } = useSelector(state => state.budgets);
  const { items: goals } = useSelector(state => state.goals);

  const [selectedPeriod, setSelectedPeriod] = useState('6');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  useEffect(() => {
    // Component will re-render when data changes
  }, [transactions, budgets, goals]);

  const getMonthlyData = () => {
    const months = [];
    const incomeData = [];
    const expenseData = [];
    
    const period = parseInt(selectedPeriod);
    const year = parseInt(selectedYear);
    
    for (let i = period - 1; i >= 0; i--) {
      const date = subMonths(new Date(year, 11, 31), i);
      const monthName = format(date, 'MMM');
      months.push(monthName);
      
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      incomeData.push(income);
      expenseData.push(expenses);
    }
    
    return { months, incomeData, expenseData };
  };

  const getCategoryData = () => {
    const categoryMap = new Map();
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const amount = parseFloat(t.amount);
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + amount);
      });
    
    const categories = Array.from(categoryMap.keys());
    const amounts = Array.from(categoryMap.values());
    
    return { categories, amounts };
  };

  const getBudgetComparisonData = () => {
    return budgets.map(budget => ({
      name: budget.name,
      limit: budget.limit,
      spent: budget.spent,
      remaining: budget.limit - budget.spent,
      percentage: (budget.spent / budget.limit) * 100
    }));
  };

  const getTopTransactions = () => {
    return transactions
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
      .slice(0, 10);
  };

  const { months, incomeData, expenseData } = getMonthlyData();
  const { categories, amounts } = getCategoryData();
  const budgetComparison = getBudgetComparisonData();
  const topTransactions = getTopTransactions();

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  const categoryChartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
          '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const budgetChartData = {
    labels: budgetComparison.map(b => b.name),
    datasets: [
      {
        label: 'Spent',
        data: budgetComparison.map(b => b.spent),
        backgroundColor: budgetComparison.map(b => 
          b.percentage > 100 ? '#FF6B6B' : 
          b.percentage > 90 ? '#FFA500' : '#4ECDC4'
        ),
        borderWidth: 1,
        borderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Financial Overview'
      }
    }
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const getNetWorth = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  return (
    <div>
      <h1 className="mb-4">Financial Reports & Analytics</h1>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Time Period</Form.Label>
                <Form.Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="3">Last 3 Months</option>
                  <option value="6">Last 6 Months</option>
                  <option value="12">Last 12 Months</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>${getTotalIncome().toFixed(2)}</h3>
            <p>Total Income</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>${getTotalExpenses().toFixed(2)}</h3>
            <p>Total Expenses</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3 className={getNetWorth() >= 0 ? 'text-success' : 'text-danger'}>
              ${getNetWorth().toFixed(2)}
            </h3>
            <p>Net Worth</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stats-card text-center">
            <h3>{transactions.length}</h3>
            <p>Total Transactions</p>
          </div>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Income vs Expenses Trend</h5>
            </Card.Header>
            <Card.Body>
              <Line data={lineChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Expense Categories</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={categoryChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Budget vs Actual Spending</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={budgetChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Budget Performance</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Limit</th>
                    <th>Spent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetComparison.map((budget, index) => (
                    <tr key={index}>
                      <td>{budget.name}</td>
                      <td>${budget.limit.toFixed(2)}</td>
                      <td>${budget.spent.toFixed(2)}</td>
                      <td>
                        <Badge 
                          bg={
                            budget.percentage > 100 ? 'danger' : 
                            budget.percentage > 90 ? 'warning' : 'success'
                          }
                        >
                          {budget.percentage.toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Transactions */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Top 10 Transactions by Amount</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {topTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <Badge 
                          bg="secondary"
                          style={{ 
                            backgroundColor: budgets.find(b => b.name === transaction.category)?.color 
                          }}
                        >
                          {transaction.category}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={transaction.type === 'income' ? 'success' : 'danger'}>
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className={transaction.type === 'income' ? 'text-success' : 'text-danger'}>
                        <strong>
                          {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
