const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();
const { join } = require("path");
const app = express();

// MongoDB connection
async function conn() {
  try {
    mongoose.connect(
      process.env.DATABASE,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
}
conn();
// MongoDB schema and model
const tickerSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Ticker = mongoose.model("Ticker", tickerSchema);
app.use(express.static(join(__dirname, "public")));
// API endpoint to fetch and store top 10 tickers
app.get("/api/top-10-tickers", async (req, res) => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = response.data;

    // Filter top 10 tickers
    const top10Tickers = Object.values(tickers)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    // Store top 10 tickers in MongoDB
    await Ticker.deleteMany({});
    await Ticker.insertMany(top10Tickers);

    res.send("Top 10 tickers stored successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching and storing top 10 tickers!");
  }
});

// API endpoint to fetch top 10 tickers from MongoDB
app.get("/api/top-10-tickers-from-db", async (req, res) => {
  try {
    const top10Tickers = await Ticker.find().sort({ volume: -1 }).limit(10);

    res.send(top10Tickers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching top 10 tickers from database!",err,process.env.DATABASE);
  }
});
app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});
// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
