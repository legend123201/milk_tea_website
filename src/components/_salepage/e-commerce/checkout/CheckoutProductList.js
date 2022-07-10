/* eslint-disable camelcase */
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Table,
  Stack,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer
} from '@mui/material';
// router
import { useNavigate } from 'react-router';
import { PATH_SALEPAGE } from '../../../../routes/paths';
// redux
import { useDispatch } from '../../../../redux/store';
import { deleteCart, getCartList, updateCart } from '../../../../redux/slices/cart';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
//
import { MIconButton } from '../../../@material-extend';

// ----------------------------------------------------------------------
const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func
};

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <MIconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Icon icon={minusFill} width={16} height={16} />
        </MIconButton>
        {quantity}
        <MIconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
          <Icon icon={plusFill} width={16} height={16} />
        </MIconButton>
      </IncrementerStyle>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography>
    </Box>
  );
}

ProductList.propTypes = {
  listCart: PropTypes.array
};

export default function ProductList({ listCart }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.myCustomUser.data);

  const loadBackCartList = () => {
    const excuteAfterGetList = (globalStateNewest) => {
      const stateCart = globalStateNewest.cart;
      if (!stateCart.isSuccess) {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(stateCart.errorMessage, { variant });
      }
    };

    dispatch(getCartList(currentUser.id, excuteAfterGetList));
  };

  const excuteAfterUpdateCartItem = (globalStateNewest) => {
    const stateCart = globalStateNewest.cart;
    if (stateCart.isSuccess) {
      const variant = 'success';
      // variant could be success, error, warning, info, or default
      // enqueueSnackbar('Update cart item success', { variant });

      loadBackCartList();
    } else {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateCart.errorMessage, { variant });
    }
  };

  const handleDelateCart = (productId) => {
    if (currentUser) {
      const excuteAfterDeleteCart = (globalStateNewest) => {
        const stateCart1 = globalStateNewest.cart;
        if (!stateCart1.isSuccess) {
          const variant = 'error';
          // variant could be success, error, warning, info, or default
          enqueueSnackbar(stateCart1.errorMessage, { variant });
        }

        const variant = 'success';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar('Delete success', { variant });

        loadBackCartList();
      };

      dispatch(deleteCart(currentUser.id, productId, excuteAfterDeleteCart));
    }
  };

  const handleIncreaseQuantity = (productId, inCartQuantity) => {
    const putCart = {
      user_id: currentUser.id,
      product_id: productId,
      quantity: inCartQuantity + 1
    };

    dispatch(updateCart(putCart, excuteAfterUpdateCartItem));
  };

  const handleDecreaseQuantity = (productId, inCartQuantity) => {
    const putCart = {
      user_id: currentUser.id,
      product_id: productId,
      quantity: inCartQuantity - 1
    };

    dispatch(updateCart(putCart, excuteAfterUpdateCartItem));
  };

  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Quantity</TableCell>
            <TableCell align="right">Total Price</TableCell>
            <TableCell align="right" />
            <TableCell align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {listCart.map((item) => {
            const { product_id, quantity, name, unit_sale_price, measure_unit, image, quantity_in_stock } = item;
            return (
              <TableRow key={product_id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ThumbImgStyle alt="product image" src={image} />
                    <Box>
                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240, mb: 0.5 }}>
                        {name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="left">{fCurrency(unit_sale_price)}</TableCell>

                {/* <TableCell align="left">{quantity}</TableCell> */}
                <TableCell align="left">
                  <Incrementer
                    quantity={quantity}
                    available={quantity_in_stock}
                    onDecrease={() => handleDecreaseQuantity(product_id, quantity)}
                    onIncrease={() => handleIncreaseQuantity(product_id, quantity)}
                  />
                </TableCell>

                <TableCell align="right">{fCurrency(unit_sale_price * quantity)}</TableCell>

                <TableCell align="right">
                  <MIconButton
                    onClick={() => {
                      navigate(`${PATH_SALEPAGE.root}/product/${product_id}`);
                    }}
                  >
                    <Icon icon={editFill} width={20} height={20} />
                  </MIconButton>
                </TableCell>

                <TableCell>
                  <MIconButton onClick={() => handleDelateCart(product_id)}>
                    <Icon icon={trash2Fill} width={20} height={20} />
                  </MIconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
