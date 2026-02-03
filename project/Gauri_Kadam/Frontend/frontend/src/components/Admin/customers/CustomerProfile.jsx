import { NavLink, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar";

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <>
      <AdminNavbar />

      <div className="container">
        {!customer ? (
          <p>Loading customer...</p>
        ) : (
          <>
            <h2>{customer.name}</h2>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone}</p>
          </>
        )}

        <div className="tabs">
          <NavLink to="orders">Orders</NavLink>
          <NavLink to="bookings">Bookings</NavLink>
          <NavLink to="cart">Cart</NavLink>
          <NavLink to="payments">Payments</NavLink>
          <NavLink to="activity">Activity</NavLink>
        </div>

        <Outlet />
      </div>
    </>
  );
};

export default CustomerProfile;
