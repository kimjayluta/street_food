const SalesLog = require('../models/salesLogModel');

exports.getAllSalesLogs = (req, res) => {
  SalesLog.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getSalesLogById = (req, res) => {
  const { id } = req.params;
  SalesLog.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

exports.createSalesLog = (req, res) => {
  const data = req.body;
  SalesLog.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Sales log added successfully!', id: result.insertId });
  });
};

exports.updateSalesLog = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  SalesLog.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Sales log updated successfully!' });
  });
};

exports.deleteSalesLog = (req, res) => {
  const { id } = req.params;
  SalesLog.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Sales log deleted successfully!' });
  });
};