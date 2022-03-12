import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// redux
import { useSelector } from 'react-redux';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';
import { PATH_SALEPAGE } from '../../../routes/paths';
import { useDispatch } from '../../../redux/store';
import { updateMyCustomUser } from '../../../redux/slices/myCustomUser';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector((state) => state.myCustomUser.data);

  const UpdateProfileSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name required'),
    phone: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Phone required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    address: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Address required')
  });

  const formik = useFormik({
    initialValues: {
      name: user ? user.name : '',
      phone: user ? user.phone : '',
      email: user ? user.email : '',
      address: user ? user.address : ''
    },
    validationSchema: UpdateProfileSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const excuteAfterUpdateProfile = async (globalStateNewest) => {
          const stateMyCustomUser = globalStateNewest.myCustomUser;
          if (stateMyCustomUser.isSuccess) {
            enqueueSnackbar('Update profile success', {
              variant: 'success',
              action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </MIconButton>
              )
            });
            if (isMountedRef.current) {
              setSubmitting(false);
            }
          } else {
            const variant = 'error';
            // variant could be success, error, warning, info, or default
            enqueueSnackbar(stateMyCustomUser.errorMessage, { variant });
          }
        };

        if (user) {
          dispatch(updateMyCustomUser(user.id, { ...user, ...values }, excuteAfterUpdateProfile));
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            autoComplete="name"
            type="text"
            label="Name"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />

          <TextField
            fullWidth
            autoComplete="phone"
            type="text"
            label="Phone"
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />

          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="address"
            type="text"
            label="Address"
            {...getFieldProps('address')}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Update profile
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
