import { useSelector } from 'react-redux';
import { merge } from 'lodash';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField, Typography } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function AppAreaInstalled() {
  const [seriesData, setSeriesData] = useState(2019);
  const listRevenueByMonth = useSelector((state) => state.analytic.listRevenueByMonth);
  const currentYear = new Date().getFullYear();

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'October', 'Nov', 'Dec']
    },
    tooltip: { x: { show: false }, marker: { show: false } }
  });

  return (
    <>
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        Revenue by month in {currentYear}
      </Typography>
      <ReactApexChart
        type="line"
        series={[{ name: 'Revenue by month', data: listRevenueByMonth }]}
        options={chartOptions}
        height={320}
      />
    </>
  );
}
