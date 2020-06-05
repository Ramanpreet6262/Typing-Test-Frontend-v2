import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 650,
    height: '45%',
    backgroundColor: theme.palette.background.paper,
    border: '4px solid #61dafb',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: '0'
  }
}));

export default function ResultModal(props) {
  const classes = useStyles();

  return (
    <div>
      <Modal
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={props.open}
        onClose={props.handleClose}
      >
        <div className={classes.paper}>{props.children}</div>
      </Modal>
    </div>
  );
}
