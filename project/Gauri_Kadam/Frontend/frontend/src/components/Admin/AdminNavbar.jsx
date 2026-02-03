import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <nav className="navbar">
      <h2>Admin Panel</h2>
      <div className="nav-links">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/customers">Customers</Link>
        <Link to="/admin/fooditems">Food</Link>
        <Link to="/admin/feedback">Feedback</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
