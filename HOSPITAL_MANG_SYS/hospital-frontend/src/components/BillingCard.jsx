// src/components/BillingCard.jsx
import React from 'react';
import './BillingCard.css';

function BillingCard({ bill }) {
  const statusColor = bill.status === 'Paid' ? 'green' : 'orange';

  return (
    <div className={`billing-card ${statusColor}`}>
      <div className="billing-header">
        <div className="bill-id">
          <p className="label">Bill #</p>
          <p className="value">{bill.bill_id}</p>
        </div>
        <div className="bill-amount">
          <p className="label">Amount</p>
          <p className="value amount">₹{bill.amount}</p>
        </div>
        <div className={`bill-status ${statusColor}`}>
          {bill.status === 'Paid' ? '✓ Paid' : '⏳ Pending'}
        </div>
      </div>

      <div className="billing-details">
        <p><strong>Date:</strong> {new Date(bill.billing_date).toLocaleDateString()}</p>
        {bill.details && <p><strong>Details:</strong> {bill.details}</p>}
      </div>

      {bill.status === 'Unpaid' && (
        <button className="btn-pay">💳 Pay Now</button>
      )}
    </div>
  );
}

export default BillingCard;
