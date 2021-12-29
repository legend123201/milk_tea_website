import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import MyCustomAlertDialog from '../../../MyCustomAlertDialog';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

MyCustomListMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default function MyCustomListMoreMenu({ onDelete, onEdit }) {
  const ref = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // mở menu
  const handleClickOpenMenu = () => {
    setOpenMenu(true);
  };

  // đóng menu
  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  // mở dialog
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  // khi dialog đóng thì cả 2 đều đóng
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenMenu(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={handleClickOpenMenu}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={openMenu}
        anchorEl={ref.current}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleClickOpenDialog} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={onEdit} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
      <MyCustomAlertDialog open={openDialog} handleCloseDialog={handleCloseDialog} handleAgree={onDelete} />
    </>
  );
}
