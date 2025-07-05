const db = require('../config/db');
const { get } = require('../routes/tindera');

const Tindera = {
    getAll: (callback) => {
        const query = 'SELECT * FROM tindera;';
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = 'SELECT * FROM tindera WHERE id = ?;';
        db.query(query, [id], callback);
    },

    create: (data, callback) => {
        const query = 'INSERT INTO tindera (name, contact) VALUES (?, ?);';
        db.query(query, [data.name, data.contact], callback);
    },

    update: (id, data, callback) => {
        const query = 'UPDATE tindera SET name = ?, contact = ? WHERE id = ?;';
        db.query(query, [data.name, data.contact, id], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM tindera WHERE id = ?;';
        db.query(query, [id], callback);
    },
};

module.exports = Tindera;