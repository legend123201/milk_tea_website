import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography } from '@mui/material';
import MyCustomAlertDialog from '../../components/MyCustomAlertDialog';
// slices
import { getCartList } from '../../redux/slices/cart';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_SALEPAGE } from '../../routes/paths';
//
import Scrollbar from '../../components/Scrollbar';
import EmptyContent from '../../components/EmptyContent';
import { CheckoutSummary, CheckoutProductList } from '../../components/_salepage/e-commerce/checkout';

// ---------------------------------------------------------------------

export default function CheckoutCart() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  // useSelector
  const { listData } = useSelector((state) => state.cart);
  // useState
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const isEmptyCart = listData.length === 0;

  useEffect(() => {
    const excuteAfterGetList = (globalStateNewest) => {
      if (!globalStateNewest.cart.isSuccess) {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(globalStateNewest.cart.errorMessage, { variant });
      }
    };

    dispatch(getCartList(1, excuteAfterGetList));
  }, [dispatch]);

  useEffect(() => {
    if (listData && listData.length > 0) {
      const totalPrice = listData.reduce((total, item, index) => total + item.unit_sale_price * item.quantity, 0);
      setTotal(totalPrice);
    }
  }, [listData]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const totalItems = listData.length;

  return (
    <>
      <MyCustomAlertDialog
        title="Verifying"
        contentText="Are you sure you want to checkout?"
        open={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleAgree={() => {}}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={
                <Typography variant="h6">
                  Card
                  <Typography component="span" sx={{ color: 'text.secondary' }}>
                    &nbsp;({totalItems} item)
                  </Typography>
                </Typography>
              }
              sx={{ mb: 3 }}
            />

            {!isEmptyCart ? (
              <Scrollbar>
                <CheckoutProductList listCart={listData} />
              </Scrollbar>
            ) : (
              <EmptyContent
                title="Cart is empty"
                description="Look like you have no items in your shopping cart."
                img="/static/illustrations/illustration_empty_cart.svg"
              />
            )}
          </Card>

          <Button
            color="inherit"
            component={RouterLink}
            to={PATH_SALEPAGE.shop}
            startIcon={<Icon icon={arrowIosBackFill} />}
          >
            Continue Shopping
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary total={total} />
          <Button fullWidth size="large" variant="contained" onClick={() => setOpenDialog(true)}>
            Check Out
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
