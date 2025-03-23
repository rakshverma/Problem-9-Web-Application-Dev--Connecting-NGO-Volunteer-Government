import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const userRole = decoded.role;
        
        switch(userRole) {
          case 'volunteer':
            navigate(`/volunteer/${userId}/dashboard`);
            break;
          case 'ngo':
            navigate(`/ngo/${userId}/dashboard`);
            break;
          case 'government':
            navigate(`/government/${userId}/dashboard`);
            break;
          default:
            navigate('/');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl">Redirecting to your dashboard...</p>
    </div>
  );
};

export default Dashboard;
