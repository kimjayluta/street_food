const db = require('../config/db');

const Expense = {
  getAll: (callback) => {
    const query = 'SELECT * FROM expenses';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM expenses WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (data, callback) => {
    const query = 'INSERT INTO expenses (description, amount, expense_date, pwesto_id) VALUES (?, ?, ?, ?)';
    db.query(query, [data.description, data.amount, data.expense_date, data.pwesto_id], callback);
  },

  update: (id, data, callback) => {
    const query = 'UPDATE expenses SET description = ?, amount = ?, expense_date = ?, pwesto_id = ? WHERE id = ?';
    db.query(query, [data.description, data.amount, data.expense_date, data.pwesto_id, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = Expense;
