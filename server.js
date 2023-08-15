const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB connection URL
const mongoUrl = 'mongodb://mongo:27017/mydatabase';

// Create a Mongoose schema
const itemSchema = new mongoose.Schema({
  order: Number,
  fruit: String,   
  qty: Number,     
  rating: Number
});

// Create a Mongoose model based on the schema
const Item = mongoose.model('Item', itemSchema);

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send(`
    <form action="/create" method="POST">
      <label for="fruit">Fruit:</label>
      <input type="text" name="fruit" required><br>
      <label for="qty">Qty:</label>
      <input type="number" name="qty" required><br>
      <label for="rating">Rating:</label>
      <input type="number" name="rating" required><br>
      <button type="submit">Submit</button>
    </form>
    <a href="/data"><button>View Data</button></a>
  `);
});

app.post('/create', async (req, res) => {
  const { fruit, qty, rating } = req.body;

  // Find the maximum order value
  const maxOrderItem = await Item.findOne().sort('-order');
  const maxOrder = maxOrderItem ? maxOrderItem.order : 0;

  // Create a new document using the Mongoose model
  try {
    const newItem = new Item({ order: maxOrder + 1, fruit, qty, rating });
    await newItem.save();
    res.send('Data inserted successfully');
  } catch (insertErr) {
    console.error('Error inserting data:', insertErr);
    res.status(500).send('Error inserting data into collection');
  }
});

app.get('/data', async (req, res) => {
  try {
    // Read all data from the collection, sorted by order
    const data = await Item.find().sort('order');

    // Transform data to desired format
    const transformedData = data.map(item => ({
      id: item.order,
      fruit: item.fruit,
      qty: item.qty,
      rating: item.rating
    }));

    res.json(transformedData);
  } catch (readErr) {
    console.error('Error reading data:', readErr);
    res.status(500).send('Error reading data from collection');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});



