const db = require('../config/db');

const SalesLog = {
  getAll: (callback) => {
    const query = 'SELECT * FROM sales_logs';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM sales_logs WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (data, callback) => {
    const insertQuery = `
      INSERT INTO sales_logs 
      (tindera_id, pwesto_id, paninda_id, quantity, leftover, total_sales) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [
      data.tindera_id,
      data.pwesto_id,
      data.paninda_id,
      data.quantity,
      data.leftover,
      data.total_sales
    ], callback);
  },

  update: (id, data, callback) => {
    const updateQuery = `
      UPDATE sales_logs 
      SET tindera_id = ?, pwesto_id = ?, paninda_id = ?, quantity = ?, leftover = ?, total_sales = ?
      WHERE id = ?
    `;

    db.query(updateQuery, [
      data.tindera_id,
      data.pwesto_id,
      data.paninda_id,
      data.quantity,
      data.leftover,
      data.total_sales,
      id
    ], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM sales_logs WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = SalesLog;