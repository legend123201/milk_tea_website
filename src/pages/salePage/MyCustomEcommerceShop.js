import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { filter, includes, orderBy } from 'lodash';
import { useSnackbar } from 'notistack';
// material
import { Backdrop, Container, Typography, CircularProgress, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, filterProducts } from '../../redux/slices/product';
import { getMyCustomProductList } from '../../redux/slices/myCustomProduct';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import fakeRequest from '../../utils/fakeRequest';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar
} from '../../components/_salepage/e-commerce/shop';
import CartWidget from '../../components/_salepage/e-commerce/CartWidget';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { listData, isLoading } = useSelector((state) => state.myCustomProduct);
  const { enqueueSnackbar } = useSnackbar();

  const excuteAfterGetList = (globalStateNewest) => {
    if (!globalStateNewest.myCustomProduct.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(globalStateNewest.myCustomProduct.errorMessage, { variant });
    }
  };

  useEffect(() => {
    dispatch(getMyCustomProductList(excuteAfterGetList));
  }, [dispatch]);

  return (
    <Page title="Ecommerce: Shop | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Shop"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root
            },
            { name: 'Shop' }
          ]}
        />

        <ShopProductList products={listData} isLoad={isLoading} />
        <CartWidget />
      </Container>
    </Page>
  );
}
