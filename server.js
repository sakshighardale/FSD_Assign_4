require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/Product");
const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Connection Error: ", err));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Static files setup

let products = [];
let nextId = 1;

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new product
app.post("/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    const newProduct = new Product({ name, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: "Invalid Data" });
  }
});

// Delete a product from MongoDB
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received DELETE request for ID: ${id}`); // Debugging log

    // Find and delete product by ID in MongoDB
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (deletedProduct) {
      console.log(`Deleted product with ID: ${id}`);
      return res.json({ message: "Product deleted successfully" });
    } else {
      console.log(`Product with ID ${id} not found.`);
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
