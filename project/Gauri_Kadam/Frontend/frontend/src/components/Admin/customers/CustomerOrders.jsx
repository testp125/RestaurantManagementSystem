import { useEffect, useState } from "react";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h3>Orders</h3>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>₹{o.total}</td>
                <td>{o.status}</td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CustomerOrders;
