import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";  

dotenv.config();

console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

const app = express();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res) => {
 
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
