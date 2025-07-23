import React, { useState } from 'react';
import './App.css';

// Sample product data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.5
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 15999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.7
  },
  {
    id: 3,
    name: "Designer T-Shirt",
    price: 1299,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    category: "Fashion",
    rating: 4.2
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 4599,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    category: "Fashion",
    rating: 4.8
  },
  {
    id: 5,
    name: "Laptop Backpack",
    price: 2299,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "Accessories",
    rating: 4.3
  },
  {
    id: 6,
    name: "Gaming Mouse",
    price: 1799,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.6
  }
];

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['All', 'Electronics', 'Fashion', 'Accessories'];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: quantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="logo">🛒 ShopEasy</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="cart-button"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            🛒 Cart ({getTotalItems()})
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Welcome to ShopEasy</h2>
          <p>Discover amazing products at unbeatable prices!</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="categories">
        <div className="container">
          <h3>Categories</h3>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products">
        <div className="container">
          <h3>Products ({filteredProducts.length})</h3>
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="category">{product.category}</p>
                  <div className="rating">
                    {'⭐'.repeat(Math.floor(product.rating))} {product.rating}
                  </div>
                  <div className="price">₹{product.price.toLocaleString()}</div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <button 
                className="close-cart"
                onClick={() => setIsCartOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>₹{item.price.toLocaleString()}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="total">
                  <strong>Total: ₹{getTotalPrice().toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 ShopEasy. Made with ❤️ by Bhai</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
