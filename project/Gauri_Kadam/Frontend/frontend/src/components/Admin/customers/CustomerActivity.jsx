import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const icons = {
  cart: '🛒',
  payment: '💳',
  order: '📦',
  feedback: '📝',
  login: '🔐',
};

const CustomerActivity = () => {
  const { id } = useParams(); // customer id
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(
        `http://localhost:5000/api/admin/customers/${id}/activity`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActivity(res.data);
    } catch (error) {
      toast.error('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading activity...</p>;

  return (
    <>
      <h3>Activity Timeline</h3>

      {activity.length === 0 ? (
        <p>No activity found</p>
      ) : (
        <ul className="activity-timeline">
          {activity.map((a, index) => (
            <li key={index}>
              <span className="icon">
                {icons[a.activity_type] || '📌'}
              </span>
              <div>
                <p>{a.description}</p>
                <small>
                  {new Date(a.created_at).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default CustomerActivity;
