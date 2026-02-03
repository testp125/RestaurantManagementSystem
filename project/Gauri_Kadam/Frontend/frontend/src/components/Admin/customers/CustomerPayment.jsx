import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerPayment = () => {
  const { id } = useParams(); // customer id from URL
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(
        `http://localhost:5000/api/admin/customers/${id}/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments(res.data);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading payments...</p>;

  return (
    <>
      <h3>Payments</h3>

      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Gateway</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.payment_id}>
                <td>{p.payment_id}</td>
                <td>{p.gateway}</td>
                <td>₹{p.amount}</td>
                <td>
                  <span
                    className={
                      p.status === 'success' ? 'status-success' : 'status-failed'
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CustomerPayment;
