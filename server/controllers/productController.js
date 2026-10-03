const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// GET /api/products  (supports ?search=&category=&subcategory=)
const getProducts = async (req, res) => {
  try {
    const { search, category, subcategory } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.mainCategory = category;
    if (subcategory) query.subcategory = subcategory;

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products  (protected, multipart/form-data)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      mainCategory,
      subcategory,
      price,
      size,
      description,
      inStock,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const product = await Product.create({
      name,
      mainCategory,
      subcategory,
      price,
      size,
      description,
      inStock: inStock === "true" || inStock === true,
      imageUrl: req.file.path,
      cloudinaryPublicId: req.file.filename,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:id  (protected, optional new image)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      mainCategory,
      subcategory,
      price,
      size,
      description,
      inStock,
    } = req.body;

    // If new image uploaded, delete old one from Cloudinary
    if (req.file) {
      if (product.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(product.cloudinaryPublicId);
      }
      product.imageUrl = req.file.path;
      product.cloudinaryPublicId = req.file.filename;
    }

    if (name !== undefined) product.name = name;
    if (mainCategory !== undefined) product.mainCategory = mainCategory;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (price !== undefined) product.price = price;
    if (size !== undefined) product.size = size;
    if (description !== undefined) product.description = description;
    if (inStock !== undefined) product.inStock = inStock === "true" || inStock === true;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id  (protected)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(product.cloudinaryPublicId);
    }
    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/stats/dashboard  (protected)
const getStats = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const ladies = await Product.countDocuments({ mainCategory: "Ladies" });
    const kids = await Product.countDocuments({ mainCategory: "Kids" });
    const outOfStock = await Product.countDocuments({ inStock: false });

    res.json({ total, ladies, kids, outOfStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getStats,
};