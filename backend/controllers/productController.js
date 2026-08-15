import { Product } from '../models/Product.js';

// @desc   Get all products (with optional category filter)
// @route  GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'all' ? { category } : {};
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc   Get single product by ID
// @route  GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc   Create new product
// @route  POST /api/products
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      sellerId: req.user ? req.user._id : null
    };
    const newProduct = await Product.create(productData);
    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid product data', error: error.message });
  }
};

// @desc   Update product
// @route  PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating product', error: error.message });
  }
};

// @desc   Delete product
// @route  DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting product', error: error.message });
  }
};

