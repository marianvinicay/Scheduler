import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import Cookies from 'js-cookie';

import AuthManager from '../../managers/AuthManager';

function Guard({ policy, content }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [authorised, setAuthorised] = useState(false);

  useEffect(() => {
    if (!location.state) { // no saved state
      const cookie = Cookies.get('token');
      if (!cookie) { // no previous cookie
        navigate("/login", { replace: true });
      } else { // we have a cookie, need to fetch user data (= state)
        AuthManager.currentUser()
          .then((user) => {
            if (!user.policies.includes(policy)) { // Is a route within the user's policy?
              navigate("/", { replace: true, state: user });
            } else {
              setAuthorised(true);
            }
          })
          .catch((error) => {
            console.log(error);
            navigate("/", { replace: true });
          });
      }
    } else { // we have a saved state (= user data)
      if (!location.state.user.policies.includes(policy)) { // Is a route within the user's policy?
        navigate("/", { replace: true , state: location.state});
      } else {
        setAuthorised(true);
      }
    }
  }, [location, navigate, policy]);

  if (!authorised) {
    return (
      <div className="empty" />
    );
  }

  return content;
}

export default Guard;
