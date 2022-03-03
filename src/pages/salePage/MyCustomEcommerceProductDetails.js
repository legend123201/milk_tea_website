import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import clockFill from '@iconify/icons-eva/clock-fill';
import roundVerified from '@iconify/icons-ic/round-verified';
import roundVerifiedUser from '@iconify/icons-ic/round-verified-user';
import { useSnackbar } from 'notistack';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Skeleton, Container, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProduct } from '../../redux/slices/product';
import { getMyCustomProduct } from '../../redux/slices/myCustomProduct';
// routes
import { PATH_SALEPAGE } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductDetailsSumary from '../../components/_salepage/e-commerce/product-details/ProductDetailsSumary';
import CartWidget from '../../components/_salepage/e-commerce/CartWidget';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={7}>
      <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '100%', borderRadius: 2 }} />
    </Grid>
    <Grid item xs={12} md={6} lg={5}>
      <Skeleton variant="circular" width={80} height={80} />
      <Skeleton variant="text" height={240} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
    </Grid>
  </Grid>
);

export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [value, setValue] = useState('1');
  const product = useSelector((state) => state.myCustomProduct.data);
  const { enqueueSnackbar } = useSnackbar();

  const excuteAfterGetItem = (globalStateNewest) => {
    if (!globalStateNewest.myCustomProduct.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(globalStateNewest.myCustomProduct.errorMessage, { variant });
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getMyCustomProduct(id, excuteAfterGetItem));
    }
  }, [dispatch]);

  return (
    <Page title="Ecommerce: Product Details | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            {
              name: 'Shop',
              href: PATH_SALEPAGE.shop
            },
            { name: 'Detail' }
          ]}
        />

        <CartWidget />

        {product && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductImgStyle alt={product.name} src={product.image} />
                </Grid>
                <Grid item xs={12} md={6} lg={5} sx={{ border: '1px dashed grey', borderRadius: '16px' }}>
                  <Box>
                    <ProductDetailsSumary product={product} />
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </>
        )}

        {!product && SkeletonLoad}

        {!product && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}
