import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { filter, includes, orderBy } from 'lodash';
import { useSnackbar } from 'notistack';
// material
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import { useTheme, styled } from '@mui/material/styles';
import {
  Container,
  Stack,
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, filterProducts } from '../../redux/slices/product';
import {
  getMyCustomProductList,
  getNewestMyCustomProductList,
  getBestSellingMyCustomProductList
} from '../../redux/slices/myCustomProduct';
import { getCartList } from '../../redux/slices/cart';
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

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { listData, listNewestData, listBestSellingData, isLoading } = useSelector((state) => state.myCustomProduct);
  const currentUser = useSelector((state) => state.myCustomUser.data);
  const { enqueueSnackbar } = useSnackbar();
  const [listDataFiltered, setListDataFiltered] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setListDataFiltered(listData);
  }, [listData]);

  // fetch item list
  useEffect(() => {
    const excuteAfterGetList = (globalStateNewest) => {
      const stateMyCustomProduct = globalStateNewest.myCustomProduct;
      if (!stateMyCustomProduct.isSuccess) {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(stateMyCustomProduct.errorMessage, { variant });
      }
    };

    dispatch(getMyCustomProductList(excuteAfterGetList));
  }, [dispatch]);

  // fetch newest item list
  useEffect(() => {
    const excuteAfterGetList = (globalStateNewest) => {
      const stateMyCustomProduct = globalStateNewest.myCustomProduct;
      if (!stateMyCustomProduct.isSuccess) {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(stateMyCustomProduct.errorMessage, { variant });
      }
    };

    dispatch(getNewestMyCustomProductList(excuteAfterGetList));
  }, [dispatch]);

  // fetch best selling item list
  useEffect(() => {
    const excuteAfterGetList = (globalStateNewest) => {
      const stateMyCustomProduct = globalStateNewest.myCustomProduct;
      if (!stateMyCustomProduct.isSuccess) {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(stateMyCustomProduct.errorMessage, { variant });
      }
    };

    dispatch(getBestSellingMyCustomProductList(excuteAfterGetList));
  }, [dispatch]);

  // fetch list item in cart
  useEffect(() => {
    if (currentUser) {
      const excuteAfterGetList = (globalStateNewest) => {
        const stateCart = globalStateNewest.cart;
        if (!stateCart.isSuccess) {
          const variant = 'error';
          // variant could be success, error, warning, info, or default
          enqueueSnackbar(stateCart.errorMessage, { variant });
        }
      };

      dispatch(getCartList(currentUser.id, excuteAfterGetList));
    }
  }, [dispatch, currentUser]);

  const handleOnChangeSearchInput = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (val !== '') {
      setListDataFiltered([...listData].filter((item, index) => item.name.toLowerCase().includes(val.toLowerCase())));
    } else {
      setListDataFiltered(listData);
    }
  };

  return (
    <Page title="Ecommerce: Shop | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Shop" links={[{ name: 'Shop' }]} />

        {/* Newest Products */}
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          New Products
        </Typography>

        <Box sx={{ mt: 2 }}>
          {listNewestData.length > 0 ? (
            <ShopProductList products={listNewestData} isLoad={isLoading} />
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              No item found!
            </Typography>
          )}
        </Box>

        {/* Best selling Products */}
        <Typography variant="h3" sx={{ textAlign: 'center', mt: 10 }}>
          Best selling
        </Typography>

        <Box sx={{ mt: 2 }}>
          {listBestSellingData.length > 0 ? (
            <ShopProductList products={listBestSellingData} isLoad={isLoading} />
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              No item found!
            </Typography>
          )}
        </Box>

        {/* All Products */}
        <Typography variant="h3" sx={{ textAlign: 'center', mt: 10, mb: 5 }}>
          All Products
        </Typography>

        <SearchStyle
          value={searchValue}
          onChange={handleOnChangeSearchInput}
          placeholder="Search by name..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />

        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <ShopProductSort products={listData} setListDataFiltered={setListDataFiltered} />
        </Stack>
        {listDataFiltered.length > 0 ? (
          <ShopProductList products={listDataFiltered} isLoad={isLoading} />
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            No item found!
          </Typography>
        )}

        <CartWidget />
      </Container>
    </Page>
  );
}
