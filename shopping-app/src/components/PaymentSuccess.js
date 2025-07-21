import React from 'react';
import './PaymentSuccess.css';

const PaymentSuccess = ({ isOpen, onClose, orderData }) => {
  if (!isOpen || !orderData) return null;

  const downloadReceipt = () => {
    const receipt = `
═══════════════════════════════════
          🛒 SHOPEASY RECEIPT
═══════════════════════════════════

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

PAYMENT METHOD: Credit/Debit Card
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
              📄 Download Receipt
            </button>
            <button onClick={onClose} className="continue-btn">
              🛒 Continue Shopping
            </button>
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