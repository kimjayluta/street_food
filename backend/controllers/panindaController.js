const Paninda = require('../models/panindaModel');

exports.getAllPaninda = (req, res) => {
  Paninda.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPanindaById = (req, res) => {
  const { id } = req.params;
  Paninda.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

exports.createPaninda = (req, res) => {
  const data = req.body;
  Paninda.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Paninda added successfully!', id: result.insertId });
  });
};

exports.updatePaninda = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Paninda.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Paninda updated successfully!' });
  });
};

exports.deletePaninda = (req, res) => {
  const { id } = req.params;
  Paninda.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Paninda deleted successfully!' });
  });
};