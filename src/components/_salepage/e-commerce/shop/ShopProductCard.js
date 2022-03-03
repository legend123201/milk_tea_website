/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import { PATH_SALEPAGE } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
//
import Label from '../../../Label';
import ColorPreview from '../../../ColorPreview';

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
  const { id, name, image, unit_sale_price, measure_unit } = product;
  const linkTo = `${PATH_SALEPAGE.root}/product/${id}`;

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

        <Stack direction="row" alignItems="center" justifyContent="end">
          <Typography variant="subtitle1">
            &nbsp;
            {unit_sale_price} / {measure_unit}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
