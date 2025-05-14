const express = require('express');
const router = express.Router();
const WorkEssential = require('../models/WorkEssential');
const { adminAuth } = require('../middleware/adminAuth.js');

router.get('/', adminAuth, async (req, res) => {
  const items = await WorkEssential.find();
  res.json(items);
});

router.post('/', adminAuth, async (req, res) => {
  const item = new WorkEssential(req.body);
  await item.save();
  res.status(201).json(item);
});

router.delete('/:id', adminAuth, async (req, res) => {
  await WorkEssential.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;