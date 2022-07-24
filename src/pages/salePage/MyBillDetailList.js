/* eslint-disable camelcase */
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { styled } from '@mui/material/styles';
import {
  Grid,
  Card,
  Button,
  CardHeader,
  Typography,
  Container,
  Box,
  Table,
  Stack,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer
} from '@mui/material';
// utils
import { fDateTime } from '../../utils/formatTime';
import { fCurrency } from '../../utils/formatNumber';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// hooks
import useSettings from '../../hooks/useSettings';
// slices
import { getCartList } from '../../redux/slices/cart';
import { getBillDetailListById } from '../../redux/slices/billDetail';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_SALEPAGE } from '../../routes/paths';

//
import Scrollbar from '../../components/Scrollbar';
import EmptyContent from '../../components/EmptyContent';
import { CheckoutSummary, CheckoutProductList } from '../../components/_salepage/e-commerce/checkout';

// ---------------------------------------------------------------------

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ---------------------------------------------------------------------

export default function CheckoutCart() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { id } = params;

  const { themeStretch } = useSettings();
  // useSelector
  const { listData } = useSelector((state) => state.billDetail);
  // useState
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const excuteAfterGetList = (globalStateNewest) => {
      const stateBillDetail = globalStateNewest.billDetail;
      if (!stateBillDetail.isSuccess) {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(stateBillDetail.errorMessage, { variant });
      }
    };

    dispatch(getBillDetailListById(id, excuteAfterGetList));
  }, [dispatch]);

  useEffect(() => {
    if (listData && listData.length > 0) {
      const totalPrice = listData.reduce((total, item, index) => total + item.currentUnitSalePrice * item.quantity, 0);
      setTotal(totalPrice);
    }
  }, [listData]);

  const totalItems = listData.length;

  return (
    <Page title="My Bill Detail: List | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Bill Detail List"
          links={[
            { name: 'Shop', href: PATH_SALEPAGE.root },
            { name: 'Bill List', href: PATH_SALEPAGE.myBills },
            { name: 'Bill Detail List' }
          ]}
        />
        <Card sx={{ mb: 3, p: 3 }}>
          <Typography variant="h3">Bill information</Typography>
          {console.log(listData)}
          <Typography variant="body1" sx={{ mt: 2 }}>
            Date: {listData[0] && fDateTime(listData[0].bill.datetime)}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Total: {fCurrency(total)}
          </Typography>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Detail
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="left">Price</TableCell>
                    <TableCell align="left">Quantity</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {listData.map((item) => {
                    const { product, quantity, currentUnitSalePrice } = item;
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ThumbImgStyle alt="product image" src={product.image} />
                            <Box>
                              <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240, mb: 0.5 }}>
                                {product.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell align="left">{fCurrency(currentUnitSalePrice)}</TableCell>

                        <TableCell align="left">{quantity}</TableCell>

                        <TableCell align="right">{fCurrency(currentUnitSalePrice * quantity)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>

        <Button
          color="inherit"
          component={RouterLink}
          to={PATH_SALEPAGE.shop}
          startIcon={<Icon icon={arrowIosBackFill} />}
        >
          Continue Shopping
        </Button>
      </Container>
    </Page>
  );
}
