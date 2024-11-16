const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// Create new booking
router.post('/', async (req, res) => {
  const { customerName, date, time } = req.body;

  // Check for duplicate bookings
  const existingBooking = await Booking.findOne({ date, time });
  if (existingBooking) {
    return res.status(400).json({ message: 'Booking already exists for the selected time.' });
  }

  const booking = new Booking({ customerName, date, time });
  try {
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a booking
router.put('/:id', async (req, res) => {
  const { customerName, date, time } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    booking.customerName = customerName || booking.customerName;
    booking.date = date || booking.date;
    booking.time = time || booking.time;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel a booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    booking.status = 'Cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
