import { useNavigate } from 'react-router-dom';
import '../styles/Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p className="sub-text">This page is restricted to administrators only.</p>
        <div className="actions">
          <button onClick={() => navigate('/')} className="home-btn">
            Go to Home
          </button>
          <button onClick={() => navigate('/store')} className="store-btn">
            Browse Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
