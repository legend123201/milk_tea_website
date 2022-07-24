import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { sortByProducts } from '../../../../redux/slices/product';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'all', label: 'All item' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' }
];

function renderLabel(label) {
  if (label === 'all') {
    return 'All item';
  }
  if (label === 'priceDesc') {
    return 'Price: High-Low';
  }
  return 'Price: Low-High';
}

ShopProductSort.propTypes = {
  products: PropTypes.array,
  setListDataFiltered: PropTypes.any
};

export default function ShopProductSort({ products, setListDataFiltered }) {
  const [open, setOpen] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortBy = (value) => {
    handleClose();
    setSortBy(value);
    console.log(value);
    if (value === 'all') {
      setListDataFiltered(products);
    } else if (value === 'priceDesc') {
      setListDataFiltered(
        [...products].sort((a, b) => {
          if (a.unitSalePrice > b.unitSalePrice) {
            return -1;
          }
          if (a.unitSalePrice < b.unitSalePrice) {
            return 1;
          }
          return 0;
        })
      );
    } else {
      setListDataFiltered(
        [...products].sort((a, b) => {
          if (a.unitSalePrice < b.unitSalePrice) {
            return -1;
          }
          if (a.unitSalePrice > b.unitSalePrice) {
            return 1;
          }
          return 0;
        })
      );
    }
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {renderLabel(sortBy)}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sortBy}
            onClick={() => handleSortBy(option.value)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
