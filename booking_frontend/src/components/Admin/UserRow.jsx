import { useState } from 'react';

import { Stack, Button } from '@mui/material';

import UserManager from '../../managers/UserManager';

function UserRow({ user }) {

  const [userPolicy, setUserPolicy] = useState(user.policy);

  return (
    <Stack direction="row" >
      {user.name}
      {user.email}
      <Button variant="contained" onClick={() => console.log(user.policies)}>
        {user.policies.map((policy) => policy.type).join(', ')}
      </Button>
    </Stack>
  );
}

export default UserRow;
