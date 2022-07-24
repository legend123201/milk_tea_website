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
    quantityInStock: Yup.number().integer().required('Quantity in stock is required').min(1).max(9999999),
    unitPerchasePrice: Yup.number().integer().required('Unit perchase price is required').min(1).max(9999999),
    unitSalePrice: Yup.number().integer().required('Unit sale price is required').min(1).max(9999999),
    measureUnit: Yup.string().required('Measure unit is required').max(50),
    image: Yup.mixed().required('Image is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentMyCustomProduct?.name || '',
      quantityInStock: currentMyCustomProduct?.quantityInStock || '',
      unitPerchasePrice: currentMyCustomProduct?.unitPerchasePrice || '',
      unitSalePrice: currentMyCustomProduct?.unitSalePrice || '',
      measureUnit: currentMyCustomProduct?.measureUnit || '',
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
                    {...getFieldProps('quantityInStock')}
                    error={Boolean(touched.quantityInStock && errors.quantityInStock)}
                    helperText={touched.quantityInStock && errors.quantityInStock}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Unit perchase price"
                    {...getFieldProps('unitPerchasePrice')}
                    error={Boolean(touched.unitPerchasePrice && errors.unitPerchasePrice)}
                    helperText={touched.unitPerchasePrice && errors.unitPerchasePrice}
                  />
                  <TextField
                    fullWidth
                    label="Unit sale price"
                    {...getFieldProps('unitSalePrice')}
                    error={Boolean(touched.unitSalePrice && errors.unitSalePrice)}
                    helperText={touched.unitSalePrice && errors.unitSalePrice}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Measure unit"
                    {...getFieldProps('measureUnit')}
                    error={Boolean(touched.measureUnit && errors.measureUnit)}
                    helperText={touched.measureUnit && errors.measureUnit}
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
