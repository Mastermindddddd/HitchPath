const express = require('express');
const Course = require('../models/Course.js');
const { adminAuth } = require('../middleware/adminAuth.js');

const router = express.Router();

// Get all courses
router.get('/courses', adminAuth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new course1
router.post('/courses', adminAuth, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: 'Invalid course data', error: err.message });
  }
});

// Delete a course
router.delete('/courses/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

