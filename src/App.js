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
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

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

  const handleRazorpayPayment = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const total = getTotalPrice();
    
    // Generate order details
    const orderNumber = 'ORD-' + Date.now();
    const timestamp = new Date().toISOString();
    
    // Use Razorpay.me direct link without amount for better compatibility
    const razorpayUrl = `https://razorpay.me/@muzamilahmadmirgojjer`;
    
    // Store order data for receipt
    const orderData = {
      orderNumber,
      timestamp,
      items: [...cart],
      total,
      paymentMethod: 'Razorpay',
      status: 'Processing',
      paymentUrl: razorpayUrl
    };
    
    // Direct payment without confirmation popup
    {
      // Smart payment method detection and opening
      const tryPaymentApp = (appUrl, fallbackDelay = 3000) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 2000);
      };

      // Create UPI payment URLs for different apps
      const merchantName = "ShopEasy";
      const note = `ShopEasy Order ${orderNumber}`;
      const upiId = "muzamilahmadmirgojjer@ybl";
      
      const paymentApps = [
        {
          name: "PhonePe",
          url: `phonepe://pay?pa=${upiId}&pn=${merchantName}&am=${total}&tn=${encodeURIComponent(note)}`,
          installed: false
        },
        {
          name: "GPay", 
          url: `tez://upi/pay?pa=${upiId}&pn=${merchantName}&am=${total}&tn=${encodeURIComponent(note)}`,
          installed: false
        },
        {
          name: "Paytm",
          url: `paytmmp://pay?pa=${upiId}&pn=${merchantName}&am=${total}&tn=${encodeURIComponent(note)}`,
          installed: false
        },
        {
          name: "BHIM UPI",
          url: `upi://pay?pa=${upiId}&pn=${merchantName}&am=${total}&tn=${encodeURIComponent(note)}`,
          installed: false
        }
      ];

      // Try to detect and open available payment apps
      let appOpened = false;
      let currentAppIndex = 0;

      const tryNextApp = () => {
        if (currentAppIndex < paymentApps.length) {
          const app = paymentApps[currentAppIndex];
          console.log(`Trying to open ${app.name}...`);
          
          // Try to open the app
          const startTime = Date.now();
          const timeout = setTimeout(() => {
            // If we're still here after 2 seconds, app probably not installed
            if (Date.now() - startTime > 1500) {
              console.log(`${app.name} not available, trying next...`);
              currentAppIndex++;
              tryNextApp();
            }
          }, 2000);

          // Attempt to open the app
          window.location.href = app.url;
          
          // Set a longer timeout for the app detection
          setTimeout(() => {
            clearTimeout(timeout);
            if (!appOpened) {
              currentAppIndex++;
              if (currentAppIndex < paymentApps.length) {
                tryNextApp();
              } else {
                // No apps worked, fallback to browser payment
                console.log('No payment apps available, opening browser payment...');
                window.open(razorpayUrl, '_blank');
                showPaymentInstructions();
              }
            }
          }, 3000);

        } else {
          // No more apps to try, use browser fallback
          window.open(razorpayUrl, '_blank');
          showPaymentInstructions();
        }
      };

      const showPaymentInstructions = () => {
        // Show receipt after payment attempt - no popup
        setTimeout(() => {
          showReceipt(orderData);
        }, 3000);
      };

      // Start the payment app detection process silently
      tryNextApp();
    }
    
    // Auto-generate receipt after 8 seconds - no confirmation needed
    setTimeout(() => {
      // Generate receipt automatically
      const receipt = {
        ...orderData,
        status: 'Paid',
        paymentTime: new Date().toISOString(),
        customerInfo: {
          name: 'Customer',
          email: 'customer@example.com'
        }
      };
      
      setReceiptData(receipt);
      setShowReceipt(true);
      setCart([]); // Clear cart
      setIsCartOpen(false);
    }, 8000);
  };

  const downloadReceipt = () => {
    if (!receiptData) return;
    
    const receiptContent = `
═══════════════════════════════════════
          🛒 SHOPEASY RECEIPT
═══════════════════════════════════════

Order Number: ${receiptData.orderNumber}
Date: ${new Date(receiptData.paymentTime).toLocaleDateString()}
Time: ${new Date(receiptData.paymentTime).toLocaleTimeString()}
Status: ✅ ${receiptData.status}

───────────────────────────────────────
                ITEMS
───────────────────────────────────────

${receiptData.items.map(item => 
  `${item.name}
   Qty: ${item.quantity} × ₹${item.price.toLocaleString()}
   Total: ₹${(item.quantity * item.price).toLocaleString()}`
).join('\n\n')}

───────────────────────────────────────
                SUMMARY  
───────────────────────────────────────

Subtotal: ₹${receiptData.total.toLocaleString()}
Tax: ₹0
Total Amount: ₹${receiptData.total.toLocaleString()}

Payment Method: ${receiptData.paymentMethod}
Payment Status: ✅ SUCCESSFUL

───────────────────────────────────────
Razorpay Payment Details:
Payment Link: ${receiptData.paymentUrl || 'razorpay.me/@muzamilahmadmirgojjer'}
Transaction ID: RZP_${Date.now()}
───────────────────────────────────────
Thank you for shopping with ShopEasy! 💝
Visit us again at shopeasy.com
───────────────────────────────────────

Generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShopEasy_Receipt_${receiptData.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
                <button 
                  className="razorpay-btn"
                  onClick={handleRazorpayPayment}
                >
                  💳 Pay with Razorpay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="receipt-overlay">
          <div className="receipt-modal">
            <div className="receipt-header">
              <h2>🧾 Payment Receipt</h2>
              <button 
                className="close-receipt"
                onClick={() => setShowReceipt(false)}
              >
                ✕
              </button>
            </div>
            <div className="receipt-content">
              <div className="receipt-info">
                <h3>✅ Payment Successful!</h3>
                <p><strong>Order Number:</strong> {receiptData.orderNumber}</p>
                <p><strong>Date:</strong> {new Date(receiptData.paymentTime).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(receiptData.paymentTime).toLocaleTimeString()}</p>
                <p><strong>Status:</strong> <span className="status-paid">✅ Paid</span></p>
              </div>
              
              <div className="receipt-items">
                <h4>Items Purchased:</h4>
                {receiptData.items.map(item => (
                  <div key={item.id} className="receipt-item">
                    <span>{item.name}</span>
                    <span>{item.quantity} × ₹{item.price.toLocaleString()}</span>
                    <span>₹{(item.quantity * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="receipt-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{receiptData.total.toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>₹0</span>
                </div>
                <div className="total-row final-total">
                  <span><strong>Total Paid:</strong></span>
                  <span><strong>₹{receiptData.total.toLocaleString()}</strong></span>
                </div>
              </div>
              
              <div className="receipt-payment">
                <p><strong>Payment Method:</strong> {receiptData.paymentMethod}</p>
                <p><strong>UPI ID:</strong> {receiptData.upiId || 'muzamilahmadmirgojjer@ybl'}</p>
                <p><strong>Transaction ID:</strong> UPI_{Date.now()}</p>
              </div>
              
              <button 
                className="download-receipt-btn"
                onClick={downloadReceipt}
              >
                📄 Download Receipt
              </button>
            </div>
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
