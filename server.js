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

// Seed data
const seedData = [
  { order: 1, fruit: 'apples', qty: 5, rating: 3 },
  { order: 2, fruit: 'bananas', qty: 7, rating: 1 },
  { order: 3, fruit: 'oranges', qty: 6, rating: 2 },
  { order: 4, fruit: 'avocados', qty: 3, rating: 5 }
];

// Insert seed data into the database if it doesn't exist
async function insertSeedData() {
  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      await Item.insertMany(seedData);
      console.log('Seed data inserted successfully');
    } else {
      console.log('Seed data already exists, skipping insertion');
    }
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
}

// Call the function to insert seed data
insertSeedData().then(() => {
  // Define routes and start the server
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
  
      // Calculate total quantity of apples
      const totalApples = data.reduce((total, item) => {
        if (item.fruit.toLowerCase() === 'apples') {
          return total + item.qty;
        }
        return total;
      }, 0);
  
      // Transform data to desired format
      const transformedData = data.map(item => ({
        id: item.order,
        fruit: item.fruit,
        qty: item.qty,
        rating: item.rating
      }));
  
      res.json({
        data: transformedData,
        totalApples: totalApples
      });
    } catch (readErr) {
      console.error('Error reading data:', readErr);
      res.status(500).send('Error reading data from collection');
    }
  });
  

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
});



