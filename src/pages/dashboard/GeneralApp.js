import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
// material
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// redux
import { useDispatch } from '../../redux/store';
import { getListRevenueByMonth, getTotalBill, getTotalUser } from '../../redux/slices/analytic';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppWidgets1,
  AppWidgets2,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppTotalDownloads,
  AppTotalInstalled,
  AppCurrentDownload,
  AppTotalActiveUsers,
  AppTopInstalledCountries
} from '../../components/_dashboard/general-app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const excuteAfterGetAnalytic = (globalStateNewest) => {
    const stateAnalytic = globalStateNewest.analytic;
    if (!stateAnalytic.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateAnalytic.errorMessage, { variant });
    }
  };

  useEffect(() => {
    dispatch(getTotalUser(excuteAfterGetAnalytic));
    dispatch(getTotalBill(excuteAfterGetAnalytic));
    dispatch(getListRevenueByMonth(excuteAfterGetAnalytic));
  }, [dispatch]);

  return (
    <Page title="General: App | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome displayName={user.displayName} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalActiveUsers />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalInstalled />
          </Grid>

          <Grid item xs={12} md={4}>
            {/* <AppTotalDownloads /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* <AppCurrentDownload /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppAreaInstalled />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppNewInvoice />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidgets1 />
              <AppWidgets2 />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
