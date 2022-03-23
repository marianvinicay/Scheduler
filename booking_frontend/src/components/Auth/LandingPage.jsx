import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import AuthManager from '../../managers/AuthManager';

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fetching, setFetching] = useState(true);
  
  useEffect(() => {
    if (!Cookies.get('token')) {
      setFetching(false);
    
    } else if (location.state) {
      if (location.state.policies.includes('admin')) {
        navigate("/admin", { replace: true, state: location.state });
  
      } else if (location.state.policies.includes('user')) {
        navigate("/dashboard", { replace: true, state: location.state });
      
      } else {
        setFetching(false);
      }
    } else {
      AuthManager.currentUser()
        .then((user) => {
          if (user.policies.includes('admin')) {
            navigate("/admin", { replace: true, state: user });

          } else if (location.state.policies.includes('user')) {
            navigate("/dashboard", { replace: true, state: user });
          
          } else {
            setFetching(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setFetching(false);
        });
    }
  }, [location]);

  if (fetching) {
    return (
      <div className="empty" />
    );
  }

  return <Navigate to="/login" />;
}

export default LandingPage;