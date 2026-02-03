import { useEffect, useState } from "react";

const CustomerCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h3>Cart Items</h3>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ₹{item.price}
          </li>
        ))}
      </ul>
    </>
  );
};

export default CustomerCart;
