import { useEffect, useState } from 'react';

import { Modal, Box, Typography, Button } from '@mui/material';

import ScheduleManager from '../../managers/ScheduleManager';

const style = {
  position: 'absolute', //as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 0,
  p: 4,
};

function ReservationPopup({ event, handleClose, handleDelete }) {
  const [created, setCreated] = useState('');

  useEffect(() => {
    if (event) {
      ScheduleManager.get(event.id)
        .then((fetchedEvent) => {
          setCreated(fetchedEvent.updated_at.toString());
        })
        .catch((error) => {
          console.log(error);
        }
      );
    }
  }, [event]);

  if (!event) {
    return (<></>);
  }

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {event.title}
        </Typography>
        <Typography id="modal-modal-description" variant="body1" component="p">
          {event.start.toString()} - {event.end.toString()}
        </Typography>
        <p>{created}</p>
        <Button variant="contained" onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ReservationPopup;