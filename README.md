# 💰 Finance Tracker

A comprehensive personal finance management application built with React, Redux, and Bootstrap. Track your income, expenses, budgets, and financial goals with beautiful visualizations and intuitive controls.

## ✨ Features

### 🏠 Dashboard
- **Financial Overview**: Monthly income, expenses, and balance at a glance
- **Quick Actions**: Add transactions, budgets, and goals with one click
- **Recent Activity**: View your latest financial transactions
- **Progress Tracking**: Monitor budget and goal progress in real-time

### 💳 Transaction Management
- **Add/Edit/Delete**: Full CRUD operations for financial transactions
- **Categorization**: Organize transactions by type (income/expense) and category
- **Search & Filter**: Find transactions by date, amount, category, or description
- **Sorting**: Sort by date, amount, or category in ascending/descending order

### 📊 Budget Management
- **Category Budgets**: Set monthly spending limits for different categories
- **Visual Progress**: Color-coded progress bars with warnings for overspending
- **Real-time Updates**: Automatic spending tracking as you add transactions
- **Reset Functionality**: Reset spending amounts monthly or as needed

### 🎯 Financial Goals
- **Goal Setting**: Create savings goals with target amounts and dates
- **Progress Tracking**: Update your progress and see completion percentages
- **Deadline Management**: Get alerts for approaching deadlines
- **Visual Motivation**: Beautiful progress indicators and achievement celebrations

### 📈 Reports & Analytics
- **Income vs Expenses**: Line charts showing financial trends over time
- **Category Breakdown**: Doughnut charts for expense categorization
- **Budget Performance**: Bar charts comparing budget limits vs. actual spending
- **Top Transactions**: Lists of highest-value transactions for insights

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router DOM v6
- **UI Framework**: Bootstrap 5 + React Bootstrap
- **Charts**: Chart.js with React Chart.js 2
- **Date Handling**: date-fns
- **Data Persistence**: Local Storage
- **Styling**: Custom CSS with modern design principles

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📱 Usage Guide

### Adding Transactions
1. Navigate to the Dashboard or Transactions page
2. Click "Add Transaction" button
3. Fill in the form:
   - **Description**: What the transaction was for
   - **Amount**: Transaction amount
   - **Type**: Income or Expense
   - **Category**: Choose from existing budget categories
   - **Date**: When the transaction occurred
   - **Notes**: Optional additional information

### Setting Up Budgets
1. Go to the Budgets page
2. Click "Add Budget Category"
3. Configure:
   - **Name**: Category name (e.g., "Food & Dining")
   - **Monthly Limit**: Maximum amount to spend
   - **Color**: Choose a theme color for visual appeal

### Creating Financial Goals
1. Visit the Goals page
2. Click "Add Financial Goal"
3. Set up:
   - **Goal Name**: What you're saving for
   - **Target Amount**: How much you need to save
   - **Current Amount**: What you've saved so far
   - **Target Date**: When you want to reach your goal
   - **Color Theme**: Personalize your goal

### Viewing Reports
1. Navigate to the Reports page
2. Use filters to select time periods
3. Explore different chart types:
   - **Trend Analysis**: See income vs. expenses over time
   - **Category Breakdown**: Understand spending patterns
   - **Budget Performance**: Track budget adherence
   - **Top Transactions**: Identify major financial events

## 🎨 Design Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Color Coding**: Visual indicators for different categories and statuses
- **Progress Bars**: Clear visual feedback for budgets and goals
- **Interactive Elements**: Hover effects and smooth transitions

## 💾 Data Persistence

All data is stored locally in your browser's localStorage, ensuring:
- **Privacy**: Your financial data stays on your device
- **Performance**: Fast loading without server requests
- **Offline Access**: Works without internet connection
- **Data Control**: You have complete control over your information

## 🔧 Customization

### Adding New Categories
- Budget categories automatically become available for transactions
- Customize colors and limits for each category
- Delete or modify categories as needed

### Personalizing Goals
- Set your own target amounts and deadlines
- Choose from various color themes
- Track multiple goals simultaneously

### Styling Options
- Modify CSS variables for color schemes
- Adjust spacing and typography
- Customize component layouts

## 📋 Project Requirements Met

✅ **State Management**: Redux Toolkit with multiple slices  
✅ **UseEffect**: Data loading, calculations, and side effects  
✅ **Form Data**: Comprehensive forms with validation  
✅ **Redux**: Centralized state management  
✅ **Navigation**: React Router with active states  
✅ **Bootstrap**: Responsive UI components and styling  

## 🚧 Future Enhancements

- **Data Export**: CSV/PDF reports
- **Cloud Sync**: Multi-device synchronization
- **Notifications**: Budget alerts and goal reminders
- **Currency Support**: Multiple currency handling
- **Investment Tracking**: Portfolio management features
- **Bill Reminders**: Automated payment tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Redux Toolkit for state management
- Bootstrap for the UI components
- Chart.js for beautiful visualizations
- The open-source community for inspiration

---

**Happy Financial Tracking! 💰📊**
