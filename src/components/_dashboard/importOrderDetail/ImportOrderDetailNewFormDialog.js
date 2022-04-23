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
import { getMyCustomProductList } from '../../../redux/slices/myCustomProduct';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------
ImportOrderDetailNewFormDialog.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
  isDuplicateProduct: PropTypes.func,
  handleAgree: PropTypes.func
};

export default function ImportOrderDetailNewFormDialog({ open, handleCloseDialog, isDuplicateProduct, handleAgree }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [errorString, setErrorString] = useState('');
  const { listData } = useSelector((state) => state.myCustomProduct); // lấy data list trên redux

  useEffect(() => {
    dispatch(getMyCustomProductList());
  }, [dispatch]);

  const ImportOrderDetailSchema = Yup.object().shape({
    product_id: Yup.number().required('Product ID is required'),
    quantity: Yup.number().integer().required('Quantity is required').min(1),
    current_unit_perchase_price: Yup.number().integer().required('Current unit perchase price is required').min(1),
    name: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      product_id: '',
      quantity: '',
      current_unit_perchase_price: '',
      name: ''
    },
    validationSchema: ImportOrderDetailSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        setSubmitting(false);
        if (isDuplicateProduct(values)) {
          setErrorString('Product is already in the list!');
        } else {
          handleAgree(values);
          handleCloseDialog();
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
    setErrorString('');
  }, [open]);

  // chọn product thì lưu giữ lại giá mua hiện tại của nó và tên của nó
  // ô input select phía dưới nếu mình xài onChange thì nó sẽ ghi đè onChange mặc định của nó
  // nên mình xài onClick thay thế
  const handleOnClick = (e) => {
    // console.log(e.target.value);
    if (e.target.value) {
      const currentProductId = e.target.value;
      const currentProduct = listData.find((item) => Number(item.id) === Number(currentProductId));
      setFieldValue('current_unit_perchase_price', currentProduct.unit_perchase_price.toString());
      setFieldValue('name', currentProduct.name.toString());
    } else {
      setFieldValue('current_unit_perchase_price', '');
      setFieldValue('name', '');
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Content text</DialogContentText> */}
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Stack spacing={3}>
                    <Stack sx={{ pt: 2 }} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        select
                        fullWidth
                        label="Product ID"
                        placeholder="Product ID"
                        {...getFieldProps('product_id')}
                        SelectProps={{ native: true }}
                        error={Boolean(touched.product_id && errors.product_id)}
                        helperText={touched.product_id && errors.product_id}
                        onClick={handleOnClick}
                      >
                        <option value="" />
                        {listData.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </TextField>
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
                    <Typography color="error">{errorString}</Typography>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button onClick={handleCloseDialog} color="inherit" sx={{ mr: 2 }}>
                        Cancel
                      </Button>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Create
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
