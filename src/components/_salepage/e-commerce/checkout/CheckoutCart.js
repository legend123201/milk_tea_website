import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography } from '@mui/material';
import MyCustomAlertDialog from '../../../MyCustomAlertDialog';
// slices
import { getCartList } from '../../../../redux/slices/cart';
import { addBill } from '../../../../redux/slices/bill';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_SALEPAGE } from '../../../../routes/paths';
//
import Scrollbar from '../../../Scrollbar';
import EmptyContent from '../../../EmptyContent';
import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  // useSelector
  const { listData } = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.myCustomUser.data);
  // useState
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const isEmptyCart = listData.length === 0;

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

  const handleAgreeCheckout = () => {
    if (!currentUser) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('Please login!', { variant });
      return;
    }

    if (totalItems <= 0) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('You not have product in cart yet!', { variant });
      return;
    }

    const excuteAfterAddBill = (globalStateNewest) => {
      const stateBill = globalStateNewest.bill;

      if (stateBill.isSuccess) {
        const variant = 'success';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar('Create bill success!', { variant });
      } else {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(stateBill.errorMessage, { variant });
      }
    };

    dispatch(addBill(currentUser.id, excuteAfterAddBill));
  };

  const totalItems = listData.length;

  return (
    <>
      <MyCustomAlertDialog
        title="Verifying"
        contentText="Are you sure you want to checkout?"
        open={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleAgree={handleAgreeCheckout}
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
