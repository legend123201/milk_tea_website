import { useState } from 'react';
import PropTypes from 'prop-types';

// material
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

// ----------------------------------------------------------------------
MyCustomAlertDialog.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
  handleAgree: PropTypes.func
};

export default function MyCustomAlertDialog({ open, handleCloseDialog, handleAgree }) {
  return (
    <div>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button onClick={handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
