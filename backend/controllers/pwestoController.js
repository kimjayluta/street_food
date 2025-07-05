const Pwesto = require('../models/pwestoModel');

exports.getAllPwesto = (req, res) => {
  Pwesto.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPwestoById = (req, res) => {
  const { id } = req.params;
  Pwesto.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

exports.createPwesto = (req, res) => {
  const data = req.body;
  Pwesto.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Pwesto added successfully!', id: result.insertId });
  });
};

exports.updatePwesto = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Pwesto.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Pwesto updated successfully!' });
  });
};

exports.deletePwesto = (req, res) => {
  const { id } = req.params;
  Pwesto.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Pwesto deleted successfully!' });
  });
};