const Expense = require('../models/expenseModel');

exports.getAllExpenses = (req, res) => {
  Expense.getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
};

exports.getExpenseById = (req, res) => {
  Expense.getById(req.params.id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results[0]);
    }
  });
};

exports.createExpense = (req, res) => {
  Expense.create(req.body, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  });
};

exports.updateExpense = (req, res) => {
  Expense.update(req.params.id, req.body, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Expense updated successfully' });
    }
  });
};

exports.deleteExpense = (req, res) => {
  Expense.delete(req.params.id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Expense deleted successfully' });
    }
  });
};
