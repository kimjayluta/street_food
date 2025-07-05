const db = require('../config/db');

const Paninda = {
  getAll: (callback) => {
    const query = 'SELECT * FROM paninda';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM paninda WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (data, callback) => {
    const query = 'INSERT INTO paninda (item_name, price) VALUES (?, ?)';
    db.query(query, [data.item_name, data.price], callback);
  },

  update: (id, data, callback) => {
    const query = 'UPDATE paninda SET item_name = ?, price = ? WHERE id = ?';
    db.query(query, [data.item_name, data.price, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM paninda WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = Paninda;