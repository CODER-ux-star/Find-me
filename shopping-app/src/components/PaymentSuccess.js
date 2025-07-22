import React, { useEffect } from 'react';
import './PaymentSuccess.css';

const PaymentSuccess = ({ isOpen, onClose, orderData }) => {

  const downloadReceipt = () => {
    const receipt = `
═══════════════════════════════════
          🛒 SHOPEASY RECEIPT
═══════════════════════════════════

STORE INFORMATION:
─────────────────────────────────
Business: ShopEasy Online Store
UPI ID: 9103594759@ybl
Website: https://muzamilmeer.github.io/Find-me/
Contact: shop@shopeasy.com

TRANSACTION DETAILS:
─────────────────────────────────

Order Number: ${orderData.orderNumber}
Date: ${new Date(orderData.timestamp).toLocaleDateString()}
Time: ${new Date(orderData.timestamp).toLocaleTimeString()}

CUSTOMER INFORMATION:
─────────────────────────────────
Name: ${orderData.customerInfo.name}
Email: ${orderData.customerInfo.email}
Phone: ${orderData.customerInfo.phone}
Address: ${orderData.customerInfo.address}
City: ${orderData.customerInfo.city}

ORDER DETAILS:
─────────────────────────────────
${orderData.items.map(item => 
  `${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}`
).join('\n')}

─────────────────────────────────
TOTAL AMOUNT: ₹${orderData.total.toLocaleString()}

PAYMENT METHOD: ${orderData.paymentMethod === 'phonepe' ? 'PhonePe UPI' : 
                   orderData.paymentMethod === 'gpay' ? 'Google Pay UPI' : 
                   orderData.paymentMethod === 'paytm' ? 'Paytm UPI' : 
                   orderData.paymentMethod === 'upi' ? 'UPI Payment' : 
                   orderData.paymentMethod === 'qr' ? 'UPI QR Code' : 'Credit/Debit Card'}
${orderData.upiId ? `UPI ID: ${orderData.upiId}` : ''}
STATUS: ✅ PAID

═══════════════════════════════════
Thank you for shopping with ShopEasy!
Visit us again at https://muzamilmeer.github.io/Find-me/
═══════════════════════════════════
    `;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShopEasy_Receipt_${orderData.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auto-download receipt after 2 seconds
  useEffect(() => {
    if (isOpen && orderData) {
      const timer = setTimeout(() => {
        downloadReceipt();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, orderData]);

  if (!isOpen || !orderData) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-content">
          <div className="success-icon">
            <div className="checkmark">
              <div className="checkmark-circle">
                <div className="checkmark-stem"></div>
                <div className="checkmark-kick"></div>
              </div>
            </div>
          </div>
          
          <h2>🎉 Payment Successful!</h2>
          <p>Thank you for your order. Your payment has been processed successfully.</p>
          
          <div className="order-details">
            <div className="detail-row">
              <span className="label">Order Number:</span>
              <span className="value">{orderData.orderNumber}</span>
            </div>
            <div className="detail-row">
              <span className="label">Total Amount:</span>
              <span className="value">₹{orderData.total.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Customer:</span>
              <span className="value">{orderData.customerInfo.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Delivery Address:</span>
              <span className="value">{orderData.customerInfo.address}, {orderData.customerInfo.city}</span>
            </div>
          </div>

          <div className="items-summary">
            <h4>📦 Items Ordered:</h4>
            {orderData.items.map(item => (
              <div key={item.id} className="item-row">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={downloadReceipt} className="download-btn">
              📄 Download Receipt Again
            </button>
            <button onClick={onClose} className="continue-btn">
              🛒 Continue Shopping
            </button>
          </div>

          <div className="auto-download-info">
            <p>📥 <strong>Receipt:</strong> Automatically downloaded! Check your downloads folder.</p>
          </div>

          <div className="delivery-info">
            <p>📦 <strong>Delivery:</strong> Your order will be delivered within 3-5 business days.</p>
            <p>📧 <strong>Email:</strong> Order confirmation sent to {orderData.customerInfo.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;