const Tindera = require('../models/tinderaModel');

exports.getAllTindera = (req, res) => {
    Tindera.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.getTinderaById = (req, res) => {
  const { id } = req.params;
  Tindera.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

exports.createTindera = (req, res) => {
  const data = req.body;
  Tindera.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Tindera added successfully!', id: result.insertId });
  });
};

exports.updateTindera = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Tindera.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Tindera updated successfully!' });
  });
};

exports.deleteTindera = (req, res) => {
  const { id } = req.params;
  Tindera.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Tindera deleted successfully!' });
  });
};