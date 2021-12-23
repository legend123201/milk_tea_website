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
import { addTodo, editTodo } from '../../../redux/slices/todo';
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

TodoNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTodo: PropTypes.object
};

export default function TodoNewForm({ isEdit, currentTodo }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewTodoSchema = Yup.object().shape({
    value: Yup.string().required('Value is required'),
    status: Yup.string().required('Status is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      value: currentTodo?.value || '',
      status: currentTodo?.status || ''
    },
    validationSchema: NewTodoSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      function excuteAfterSubmit(globalStateNewest) {
        setSubmitting(false);
        if (globalStateNewest.todo.isSuccess) {
          resetForm();
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
          navigate(PATH_DASHBOARD.todo.list);
        } else {
          const errorString = globalStateNewest.todo.errorMessage;
          enqueueSnackbar(errorString, { variant: 'error' });
          setErrors(errorString);
        }
      }
      try {
        if (!isEdit) {
          dispatch(addTodo(values, excuteAfterSubmit));
        } else {
          // trường hợp currentTodo.id === undefined sẽ ko có, tại mình sẽ bấm trực tiếp vào cái phần tử trong bảng thì mới ra trang edit
          // mình viết cái này để test kiểm tra trang edit cho nhanh bằng sidebar
          // const obj = { ...values, id: currentTodo.id};
          const obj = { ...values, id: currentTodo?.id ? currentTodo.id : -1 };
          dispatch(editTodo(obj, excuteAfterSubmit));
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Value"
                    {...getFieldProps('value')}
                    error={Boolean(touched.value && errors.value)}
                    helperText={touched.value && errors.value}
                  />
                  <TextField
                    fullWidth
                    label="Status"
                    {...getFieldProps('status')}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Todo' : 'Save Changes'}
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
