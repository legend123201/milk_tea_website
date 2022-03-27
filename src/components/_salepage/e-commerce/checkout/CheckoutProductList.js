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
import { deleteCart, getCartList } from '../../../../redux/slices/cart';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
//
import { MIconButton } from '../../../@material-extend';

// ----------------------------------------------------------------------

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

ProductList.propTypes = {
  listCart: PropTypes.array
};

export default function ProductList({ listCart }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.myCustomUser.data);

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

        const excuteAfterGetList = (globalStateNewest) => {
          const stateCart2 = globalStateNewest.cart;
          if (!stateCart2.isSuccess) {
            const variant = 'error';
            // variant could be success, error, warning, info, or default
            enqueueSnackbar(stateCart2.errorMessage, { variant });
          }
        };

        dispatch(getCartList(currentUser.id, excuteAfterGetList));
      };

      dispatch(deleteCart(currentUser.id, productId, excuteAfterDeleteCart));
    }
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
            const { product_id, quantity, name, unit_sale_price, measure_unit, image } = item;
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

                <TableCell align="left">{quantity}</TableCell>

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
