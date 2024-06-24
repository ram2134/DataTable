const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://amnvramachandra:ramachandra559@cluster0.gzkpmmq.mongodb.net/data_filtering",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the schema and model
const dataSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  subcategory: String,
  createdAt: Date,
  updatedAt: Date,
  price: Number,
  sale_price: Number,
});

const Data = mongoose.model("Data", dataSchema);

// Define the routes
app.get("/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
