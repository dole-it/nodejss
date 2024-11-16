const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Booking = require('./models/Booking');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bookingSystem') 


// Routes
app.get('/', async (req, res) => {
  const bookings = await Booking.find().sort({ date: 1, time: 1 });
  res.render('index', { bookings });
});

app.get('/new', (req, res) => {
  res.render('form', { booking: null });
});

app.get('/edit/:id', async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).send('Booking not found');
      }
      res.render('form', { booking });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.post('/new', async (req, res) => {
  const { customerName, date, time } = req.body;
  await new Booking({ customerName, date, time }).save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  res.render('form', { booking });
});

app.post('/edit/:id', async (req, res) => {
  const { customerName, date, time } = req.body;
  await Booking.findByIdAndUpdate(req.params.id, { customerName, date, time });
  res.redirect('/');
});

app.post('/cancel/:id', async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
  res.redirect('/');
});

const PORT = 5002; // Chọn một cổng khác
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

