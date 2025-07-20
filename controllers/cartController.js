const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get User's Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ 
        user: req.user._id,
        items: [{ product: productId, quantity, price: product.price }]
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
