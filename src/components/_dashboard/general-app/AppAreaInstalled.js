import { useSelector } from 'react-redux';
import { merge } from 'lodash';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function AppAreaInstalled() {
  const [seriesData, setSeriesData] = useState(2019);
  const listRevenueByMonth = useSelector((state) => state.analytic.listRevenueByMonth);

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'October', 'Nov', 'Dec']
    },
    tooltip: { x: { show: false }, marker: { show: false } }
  });

  return (
    <ReactApexChart
      type="line"
      series={[{ name: 'Renenue by month', data: listRevenueByMonth }]}
      options={chartOptions}
      height={320}
    />
  );
}
