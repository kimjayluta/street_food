const db = require('../config/db');

const Pwesto = {
  getAll: (callback) => {
    const query = 'SELECT * FROM pwesto';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM pwesto WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (data, callback) => {
    const query = 'INSERT INTO pwesto (location, tindera_id) VALUES (?, ?)';
    db.query(query, [data.location, data.tindera_id], callback);
  },

  update: (id, data, callback) => {
    const query = 'UPDATE pwesto SET location = ?, tindera_id = ? WHERE id = ?';
    db.query(query, [data.location, data.tindera_id, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM pwesto WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = Pwesto;