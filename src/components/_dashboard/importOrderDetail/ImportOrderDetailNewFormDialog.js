import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

// material
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { addMyCustomProduct, editMyCustomProduct } from '../../../redux/slices/myCustomProduct';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------
ImportOrderDetailNewFormDialog.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
  handleAgree: PropTypes.func,
  isEdit: PropTypes.bool,
  currentImportOrderDetail: PropTypes.object
};

export default function ImportOrderDetailNewFormDialog({
  open,
  handleCloseDialog,
  handleAgree,
  isEdit,
  currentImportOrderDetail
}) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const ImportOrderDetailSchema = Yup.object().shape({
    import_order_id: Yup.number().required('Import order ID is required'),
    product_id: Yup.number().required('Product ID is required'),
    quantity: Yup.number().required('Quantity is required').min(1),
    current_unit_perchase_price: Yup.number().required('Current unit perchase price is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      import_order_id: currentImportOrderDetail?.name || 1,
      product_id: currentImportOrderDetail?.quantity_in_stock || '',
      quantity: currentImportOrderDetail?.unit_perchase_price || '',
      current_unit_perchase_price: currentImportOrderDetail?.unit_sale_price || 9999
    },
    validationSchema: ImportOrderDetailSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      // chưa sửa xxxxxxxxxxxxxxx
      function excuteAfterSubmit(globalStateNewest) {
        setSubmitting(false);
        if (globalStateNewest.importOrderDetail.isSuccess) {
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
          // navigate(PATH_DASHBOARD.myCustomProduct.list);
        } else {
          const errorString = globalStateNewest.myCustomProduct.errorMessage;
          enqueueSnackbar(errorString, { variant: 'error' });
          setErrors(errorString);
          handleCloseDialog(); // thất bại thì đóng dialog để thấy đc snackbar
        }
      }
      try {
        if (!isEdit) {
          console.log(values);
          // dispatch(addMyCustomProduct(values, excuteAfterSubmit));
        } else {
          // trường hợp currentMyCustomProduct.id === undefined sẽ ko có, tại mình sẽ bấm trực tiếp vào cái phần tử trong bảng thì mới ra trang edit
          // mình viết cái này để test kiểm tra trang edit cho nhanh bằng sidebar
          // const obj = { ...values, id: currentMyCustomProduct.id};
          // const obj = { ...values, id: currentMyCustomProduct?.id ? currentMyCustomProduct.id : -1 };
          // dispatch(editMyCustomProduct(obj, excuteAfterSubmit));
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  // khi tắt dialog đi mở lên lại thì nên reset form
  useEffect(() => {
    formik.resetForm();
  }, [open]);

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates occasionally.
          </DialogContentText>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Product ID"
                        {...getFieldProps('product_id')}
                        error={Boolean(touched.product_id && errors.product_id)}
                        helperText={touched.product_id && errors.product_id}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      {' '}
                      <TextField
                        fullWidth
                        label="Quantity"
                        {...getFieldProps('quantity')}
                        error={Boolean(touched.quantity && errors.quantity)}
                        helperText={touched.quantity && errors.quantity}
                      />
                    </Stack>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button onClick={handleCloseDialog} color="inherit" sx={{ mr: 2 }}>
                        Cancel
                      </Button>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {!isEdit ? 'Create Import Order Detail' : 'Save Changes'}
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAgree} variant="contained">
            Subscribe
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
