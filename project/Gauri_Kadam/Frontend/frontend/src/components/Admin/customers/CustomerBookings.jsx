import { useEffect, useState } from "react";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h3>Bookings</h3>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <strong>{booking.customerName}</strong> <br />
              Date: {booking.date} <br />
              Time: {booking.time} <br />
              People: {booking.people}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default CustomerBookings;
