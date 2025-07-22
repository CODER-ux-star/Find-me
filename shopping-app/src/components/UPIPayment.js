import React, { useState } from 'react';
import './UPIPayment.css';

const UPIPayment = ({ isOpen, onClose, cartItems, total, onPaymentSuccess }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Your UPI ID
  const UPI_ID = '9103594759@ybl';
  const MERCHANT_NAME = 'ShopEasy';

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = (paymentMethod) => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      alert('Please fill all required fields!');
      return;
    }

    const amount = total;
    const note = `ShopEasy Payment - ${cartItems.map(item => item.name).join(', ')}`;

    switch(paymentMethod) {
      case 'phonepe':
        window.open(`phonepe://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${amount}&tn=${encodeURIComponent(note)}`, '_blank');
        break;
      case 'gpay':
        window.open(`tez://upi/pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${amount}&tn=${encodeURIComponent(note)}`, '_blank');
        break;
      case 'paytm':
        window.open(`paytmmp://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${amount}&tn=${encodeURIComponent(note)}`, '_blank');
        break;
      case 'upi':
        const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${amount}&tn=${encodeURIComponent(note)}`;
        window.open(upiUrl, '_blank');
        break;
      case 'qr':
        const qrData = `upi://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${amount}&tn=${encodeURIComponent(note)}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
        setQrCode(qrUrl);
        setShowQR(true);
        return;
    }

    setTimeout(() => {
      const confirmed = window.confirm('Have you completed the payment? Click OK if payment is successful.');
      if (confirmed) {
        const orderData = {
          orderNumber: 'ORD-' + Date.now(),
          customerInfo,
          total,
          items: cartItems,
          paymentMethod,
          upiId: UPI_ID,
          timestamp: new Date().toISOString()
        };
        onPaymentSuccess(orderData);
      }
    }, 2000);
  };

  return (
    <div className="upi-modal-overlay">
      <div className="upi-modal">
        <div className="modal-header">
          <h2>💳 UPI Payment - ShopEasy</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="modal-content">
          <div className="customer-section">
            <h3>👤 Customer Information</h3>
            <div className="form-row">
              <input type="text" name="name" placeholder="Full Name *" value={customerInfo.name} onChange={handleInputChange} required />
              <input type="tel" name="phone" placeholder="Phone Number *" value={customerInfo.phone} onChange={handleInputChange} required />
            </div>
            <input type="email" name="email" placeholder="Email Address *" value={customerInfo.email} onChange={handleInputChange} required />
            <input type="text" name="address" placeholder="Delivery Address" value={customerInfo.address} onChange={handleInputChange} />
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

          <div className="payment-methods">
            <h3>💰 Choose Payment Method</h3>
            <div className="payment-grid">
              <button className="payment-btn phonepe" onClick={() => handlePayment('phonepe')}>
                <div className="payment-icon">📱</div>
                <span>PhonePe</span>
              </button>
              <button className="payment-btn gpay" onClick={() => handlePayment('gpay')}>
                <div className="payment-icon">💳</div>
                <span>Google Pay</span>
              </button>
              <button className="payment-btn paytm" onClick={() => handlePayment('paytm')}>
                <div className="payment-icon">💰</div>
                <span>Paytm</span>
              </button>
              <button className="payment-btn upi" onClick={() => handlePayment('upi')}>
                <div className="payment-icon">🏦</div>
                <span>Any UPI App</span>
              </button>
              <button className="payment-btn qr" onClick={() => handlePayment('qr')}>
                <div className="payment-icon">📱</div>
                <span>QR Code</span>
              </button>
            </div>
          </div>

          {showQR && (
            <div className="qr-section">
              <h3>📱 Scan QR Code to Pay</h3>
              <div className="qr-container">
                <img src={qrCode} alt="UPI QR Code" />
                <p>Scan with any UPI app to pay ₹{total.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="upi-details">
            <h4>💳 Payment Details:</h4>
            <p><strong>UPI ID:</strong> {UPI_ID}</p>
            <p><strong>Amount:</strong> ₹{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIPayment;
