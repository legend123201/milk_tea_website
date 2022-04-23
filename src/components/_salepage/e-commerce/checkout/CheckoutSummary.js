import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
  total: PropTypes.number
};

export default function CheckoutSummary({ total }) {
  const currentUser = useSelector((state) => state.myCustomUser.data);

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Order Summary" />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              User name:
            </Typography>
            <Typography variant="subtitle2">{currentUser?.name}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Phone number:
            </Typography>
            <Typography variant="subtitle2">{currentUser?.phone}</Typography>
          </Stack>

          <Stack justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Address:
            </Typography>
            <Typography variant="subtitle2">{currentUser?.address}</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (VAT included if applicable)
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
