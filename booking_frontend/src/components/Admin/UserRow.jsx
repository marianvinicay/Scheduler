import { useState } from 'react';

import { Stack, FormControl, InputLabel, Select, OutlinedInput, MenuItem, ListItemText, Checkbox } from '@mui/material';

import UserManager from '../../managers/UserManager';

const allPolicies = [
  'user',
  'manager',
  'admin',
];

function UserRow({ user }) {

  const [userPolicies, setUserPolicies] = useState(user.policies.map((policy) => policy.type));

  const changeUserPolicy = (event) => {
    const {
      target: { value },
    } = event;

    const newPolicies = typeof value === 'string' ? value.split(',') : value;

    UserManager.setPolicyFor(user.id, newPolicies)
      .then((updatedUser) => {
        setUserPolicies(updatedUser.policies.map((policy) => policy.type));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Stack direction="row" >
      <p>{user.name} - {user.email}</p>
      <FormControl>
        <InputLabel id="demo-multiple-checkbox-label">Policy</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={userPolicies}
          onChange={changeUserPolicy}
          input={<OutlinedInput label="Policy" />}
          renderValue={(selected) => selected.join(', ')}
          //MenuProps={MenuProps}
        >
          {allPolicies.map((policy) => (
            <MenuItem key={policy} value={policy}>
              <Checkbox checked={userPolicies.indexOf(policy) > -1} />
              <ListItemText primary={policy} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export default UserRow;
