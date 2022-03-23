import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Container, Button } from '@mui/material';
import UserRow from './UserRow';

import UserManager from '../../managers/UserManager';

function Users() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    UserManager.getCount()
      .then((count) => {
        setUserCount(count);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const skip = perPage * (page - 1);
    UserManager.getLimited(skip, perPage)
      .then((fetchedUsers) => {
        setUsers(fetchedUsers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const pageControls = () => {
    if (userCount > perPage) {
      if (page > 1) {
        return (
          <div>
            <Button variant="contained" onClick={prevPage}>
              Previous
            </Button>

            <Button variant="contained" onClick={nextPage}>
              Next
            </Button>
          </div>
        );
      }
      return (
        <div>
          <Button variant="contained" onClick={nextPage}>
            Next
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="admin-users">
      <Container fixed>
        <ul>
          {users.map((user, index) => {
            return <li key={index}><UserRow user={user} /></li>
          })}
        </ul>
        <p>{userCount}</p>
        {pageControls()}
      </Container>
    </div>
  );
}

export default Users;
