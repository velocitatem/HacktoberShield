const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

// MongoDB setup
const url = 'mongodb://db:27017';
const dbName = 'abuseDB';
let db;

const connectWithRetry = async () => {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected successfully to MongoDB server");
        db = client.db(dbName);
    } catch (err) {
        console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
        setTimeout(connectWithRetry, 5000);
    }
};

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware to check DB connection
const ensureDbConnection = (req, res, next) => {
  if (!db) {
    res.status(500).send('Database not initialized');
    return;
  }
  next();
};

// Routes
app.post('/report', ensureDbConnection, async (req, res) => {
    const { username } = req.body;
    const collection = db.collection('reports');
    const report = await collection.findOne({ username });

    if (report) {
        await collection.updateOne({ username }, { $inc: { count: 1 }});
    } else {
        await collection.insertOne({ username, count: 1 });
    }

    res.send('Reported');
});

app.get('/check', ensureDbConnection, async (req, res) => {
    const { username } = req.query;
    const collection = db.collection('reports');
    const report = await collection.findOne({ username });

    if (report) {
        res.send(`${(report.count / 10) * 100}% spam`);
    } else {
        res.send('Not spam');
    }
});

app.listen(3000, () => {
    connectWithRetry();
    console.log('Listening on port 3000');
});
