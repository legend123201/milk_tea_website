/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// material
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// routes
import { PATH_SALEPAGE } from '../../../../routes/paths';
// utils
import { fCurrency, fNumber } from '../../../../utils/formatNumber';
import { useDispatch, useSelector } from '../../../../redux/store';
//
import Label from '../../../Label';
import ColorPreview from '../../../ColorPreview';
import { addCart, deleteCart, getCartList } from '../../../../redux/slices/cart';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const { id, name, image, unitSalePrice, measureUnit } = product;
  const linkTo = `${PATH_SALEPAGE.root}/product/${id}`;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // useState
  const [isAlreadyInCart, setIsAlreadyInCart] = useState(false);

  // useSelector
  const user = useSelector((state) => state.myCustomUser.data);
  const listCart = useSelector((state) => state.cart.listData);

  useEffect(() => {
    if (listCart && listCart.length > 0) {
      const currentProductIsAdded = listCart.find((item) => item.product.id === Number(id));
      if (currentProductIsAdded) {
        setIsAlreadyInCart(true);
      } else {
        setIsAlreadyInCart(false);
      }
    } else {
      setIsAlreadyInCart(false);
    }
  }, [listCart]);

  // functions
  const loadBackCartList = () => {
    const excuteAfterGetList = (globalStateNewest) => {
      const stateCart = globalStateNewest.cart;
      if (!stateCart.isSuccess) {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(stateCart.errorMessage, { variant });
      }
    };

    dispatch(getCartList(user.id, excuteAfterGetList));
  };

  const excuteAfterDeleteCart = (globalStateNewest) => {
    const stateCart = globalStateNewest.cart;
    if (!stateCart.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateCart.errorMessage, { variant });
    }

    const variant = 'success';
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('Remove from cart success', { variant });

    loadBackCartList();
  };

  const excuteAfterAddCart = (globalStateNewest) => {
    const stateCart = globalStateNewest.cart;
    if (stateCart.isSuccess) {
      const variant = 'success';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('Add to cart success', { variant });

      loadBackCartList();
    } else {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateCart.errorMessage, { variant });
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('Please login to use cart!', { variant });
      return;
    }

    if (isAlreadyInCart) {
      dispatch(deleteCart(user.id, id, excuteAfterDeleteCart));
    } else {
      const newCart = {
        userId: user.id,
        productId: id,
        quantity: 1
      };

      dispatch(addCart(newCart, excuteAfterAddCart));
    }
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <ProductImgStyle alt={name} src={image} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box
            onClick={handleAddToCart}
            className={user && isAlreadyInCart ? 'active' : ''}
            sx={{
              cursor: 'pointer',
              '&.active': {
                color: 'red'
              },
              '&:hover': {
                color: 'rgba(0,0,0,0.5)'
              }
            }}
          >
            <ShoppingCartIcon sx={{ width: '20px', height: '20px' }} />
          </Box>

          <Typography variant="subtitle1">
            &nbsp;
            {fNumber(unitSalePrice)} vnd / {measureUnit}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
