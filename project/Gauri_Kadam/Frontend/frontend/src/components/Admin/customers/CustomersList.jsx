import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminNavbar from '../AdminNavbar';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:5000/api/admin/customers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container">
        <h2>Customers</h2>

        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/admin/customers/${c.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>
                    {c.lastActive
                      ? new Date(c.lastActive).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CustomersList;
