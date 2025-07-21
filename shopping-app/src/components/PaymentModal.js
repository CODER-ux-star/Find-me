import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import './PaymentModal.css';

// Test Stripe public key (safe to use in frontend)
const stripePromise = loadStripe('pk_test_51H1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');

const CheckoutForm = ({ total, cartItems, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Payment system is loading...');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: customerInfo.name,
        email: customerInfo.email,
        address: {
          line1: customerInfo.address,
          city: customerInfo.city,
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    // Simulate payment processing (In real app, send to backend)
    setTimeout(() => {
      // Mock successful payment
      setLoading(false);
      onSuccess({
        paymentMethod,
        customerInfo,
        total,
        items: cartItems,
        orderNumber: 'ORD-' + Date.now(),
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="customer-info">
        <h3>👤 Customer Information</h3>
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={customerInfo.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={customerInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={customerInfo.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={customerInfo.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <input
          type="text"
          name="address"
          placeholder="Delivery Address *"
          value={customerInfo.address}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="payment-section">
        <h3>💳 Payment Information</h3>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  backgroundColor: 'white',
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <div className="test-cards-info">
          <p>🧪 <strong>Test Mode:</strong> Use test card: <code>4242 4242 4242 4242</code></p>
          <p>Expiry: Any future date | CVC: Any 3 digits | ZIP: Any 5 digits</p>
        </div>
      </div>

      <div className="order-summary">
        <h3>📋 Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total: ₹{total.toLocaleString()}</strong>
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel}
          className="cancel-btn"
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={!stripe || loading}
          className="pay-btn"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            `💳 Pay ₹${total.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ isOpen, onClose, cartItems, total, onPaymentSuccess }) => {
  if (!isOpen) return null;

  const handleSuccess = (paymentData) => {
    onPaymentSuccess(paymentData);
    onClose();
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>🛒 Checkout - ShopEasy</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="modal-content">
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              total={total}
              cartItems={cartItems}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;