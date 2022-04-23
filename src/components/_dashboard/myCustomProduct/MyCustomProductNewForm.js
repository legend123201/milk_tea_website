import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { addMyCustomProduct, editMyCustomProduct } from '../../../redux/slices/myCustomProduct';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';
import countries from '../user/countries';

// ----------------------------------------------------------------------

MyCustomProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMyCustomProduct: PropTypes.object
};

export default function MyCustomProductNewForm({ isEdit, currentMyCustomProduct }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewMyCustomProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50),
    quantity_in_stock: Yup.number().integer().required('Quantity in stock is required').min(1).max(9999999),
    unit_perchase_price: Yup.number().integer().required('Unit perchase price is required').min(1).max(9999999),
    unit_sale_price: Yup.number().integer().required('Unit sale price is required').min(1).max(9999999),
    measure_unit: Yup.string().required('Measure unit is required').max(50),
    image: Yup.mixed().required('Image is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentMyCustomProduct?.name || '',
      quantity_in_stock: currentMyCustomProduct?.quantity_in_stock || '',
      unit_perchase_price: currentMyCustomProduct?.unit_perchase_price || '',
      unit_sale_price: currentMyCustomProduct?.unit_sale_price || '',
      measure_unit: currentMyCustomProduct?.measure_unit || '',
      image: currentMyCustomProduct?.image || ''
    },
    validationSchema: NewMyCustomProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      function excuteAfterSubmit(globalStateNewest) {
        setSubmitting(false);
        const stateMyCustomProduct = globalStateNewest.myCustomProduct;
        if (stateMyCustomProduct.isSuccess) {
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
          navigate(PATH_DASHBOARD.myCustomProduct.list);
        } else {
          const errorString = stateMyCustomProduct.errorMessage;
          enqueueSnackbar(errorString, { variant: 'error' });
          setErrors(errorString);
        }
      }
      try {
        if (!isEdit) {
          console.log(values);
          dispatch(addMyCustomProduct(values, excuteAfterSubmit));
        } else {
          // trường hợp currentMyCustomProduct.id === undefined sẽ ko có, tại mình sẽ bấm trực tiếp vào cái phần tử trong bảng thì mới ra trang edit
          // mình viết cái này để test kiểm tra trang edit cho nhanh bằng sidebar
          // const obj = { ...values, id: currentMyCustomProduct.id};
          const obj = { ...values, id: currentMyCustomProduct?.id ? currentMyCustomProduct.id : -1 };
          dispatch(editMyCustomProduct(obj, excuteAfterSubmit));
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const convertBase64 = (file) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('image', await convertBase64(file));
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.image}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.image && errors.image)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.image && errors.image}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Quantity in stock"
                    {...getFieldProps('quantity_in_stock')}
                    error={Boolean(touched.quantity_in_stock && errors.quantity_in_stock)}
                    helperText={touched.quantity_in_stock && errors.quantity_in_stock}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Unit perchase price"
                    {...getFieldProps('unit_perchase_price')}
                    error={Boolean(touched.unit_perchase_price && errors.unit_perchase_price)}
                    helperText={touched.unit_perchase_price && errors.unit_perchase_price}
                  />
                  <TextField
                    fullWidth
                    label="Unit sale price"
                    {...getFieldProps('unit_sale_price')}
                    error={Boolean(touched.unit_sale_price && errors.unit_sale_price)}
                    helperText={touched.unit_sale_price && errors.unit_sale_price}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Measure unit"
                    {...getFieldProps('measure_unit')}
                    error={Boolean(touched.measure_unit && errors.measure_unit)}
                    helperText={touched.measure_unit && errors.measure_unit}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Product' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
