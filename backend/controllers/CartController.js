import Cart from "../models/Cart.js";

// 🛒 Add to Cart
export const addToCart = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admin is not allowed to modify cart" });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantity;
      if (newQuantity > 0) {
        existingProduct.quantity = newQuantity;
      } else {
        cart.products = cart.products.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else if (quantity > 0) {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate("products.productId");
    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Error adding to cart" });
  }
};

// 🛒 Get Cart
export const getCart = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admin is not allowed to access cart" });
    }

    const cart = await Cart.findOne({ userId: req.user.userId }).populate(
      "products.productId"
    );

    res.json(cart || { products: [] });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Error fetching cart" });
  }
};

// 🛒 Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admin is not allowed to modify cart" });
    }

    const { productId } = req.params;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.products = cart.products.filter((p) => p.productId.equals(productId));

    await cart.save();
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ error: "Failed to remove item" });
  }
};
