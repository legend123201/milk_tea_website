/* eslint-disable camelcase */
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
