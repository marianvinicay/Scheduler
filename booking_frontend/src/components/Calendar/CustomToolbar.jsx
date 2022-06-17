import { Stack, Button } from '@mui/material';

import moment from 'moment';
import 'moment/locale/sk.js';

moment.locale('sk');

function CustomToolbar({ date, back, next }) {
  return (
    <Stack direction='row' spacing={1}>
      <Button onClick={back}>
        Back
      </Button>

      <p>{moment(date).format('dddd, DD.MM.YYYY')}</p>

      <Button onClick={next}>
        Next
      </Button>
    </Stack>
  );
}

export default CustomToolbar;