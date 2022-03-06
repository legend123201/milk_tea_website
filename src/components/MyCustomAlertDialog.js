import { useState } from 'react';
import PropTypes from 'prop-types';

// material
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

// ----------------------------------------------------------------------
MyCustomAlertDialog.propTypes = {
  title: PropTypes.string,
  contentText: PropTypes.string,
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
  handleAgree: PropTypes.func
};

export default function MyCustomAlertDialog({ title, contentText, open, handleCloseDialog, handleAgree }) {
  const onAgree = () => {
    handleCloseDialog();
    handleAgree();
  };

  return (
    <div>
      {/* Nếu ko muốn bấm ra ngoài dialog thì tắt dialog thì xóa "onClose={handleCloseDialog}" là xong */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{contentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button onClick={onAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
