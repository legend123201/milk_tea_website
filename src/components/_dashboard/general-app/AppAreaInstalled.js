import { useSelector } from 'react-redux';
import { merge } from 'lodash';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ReactExport from 'react-export-excel';
// material
import { Card, CardHeader, Box, TextField, Typography } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function AppAreaInstalled() {
  const [seriesData, setSeriesData] = useState(2019);
  const listRevenueByMonth = useSelector((state) => state.analytic.listRevenueByMonth);
  const listProfitByMonth = useSelector((state) => state.analytic.listProfitByMonth);

  const listBillReport = useSelector((state) => state.bill.listReportData);
  const listImportOrderReport = useSelector((state) => state.importOrder.listReportData);

  const currentYear = new Date().getFullYear();

  const { ExcelFile } = ReactExport;
  const { ExcelSheet, ExcelColumn } = ExcelFile;
  // const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  const dataSet1 = [
    {
      name: 'Johson',
      amount: 30000,
      sex: 'M',
      is_married: true
    },
    {
      name: 'Monika',
      amount: 355000,
      sex: 'F',
      is_married: false
    },
    {
      name: 'John',
      amount: 250000,
      sex: 'M',
      is_married: false
    },
    {
      name: 'Josef',
      amount: 450500,
      sex: 'M',
      is_married: true
    }
  ];

  const dataSet2 = [
    {
      name: 'Johnson',
      total: 25,
      remainig: 16
    },
    {
      name: 'Josef',
      total: 25,
      remainig: 7
    }
  ];
  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'October', 'Nov', 'Dec']
    },
    tooltip: { x: { show: false }, marker: { show: false } }
  });

  return (
    <>
      <ExcelFile>
        <ExcelSheet data={listBillReport} name="Bills">
          <ExcelColumn label="Bill Id" value="billId" />
          <ExcelColumn label="Date time" value="datetime" />
          <ExcelColumn label="Bill price" value="billPrice" />
          <ExcelColumn label="User name" value="userName" />
          <ExcelColumn label="Staff name" value="staffName" />
          {/* <ExcelColumn label="Marital Status" value={(col) => (col.is_married ? 'Married' : 'Single')} /> */}
        </ExcelSheet>
        <ExcelSheet data={listImportOrderReport} name="Import orders">
          <ExcelColumn label="Import Order Id" value="importOrderId" />
          <ExcelColumn label="Date time" value="datetime" />
          <ExcelColumn label="Import Order Price" value="importOrderPrice" />
          <ExcelColumn label="Staff name" value="staffName" />
        </ExcelSheet>
      </ExcelFile>
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        Revenue by month in {currentYear}
      </Typography>
      <ReactApexChart
        type="line"
        series={[{ name: 'Revenue by month', data: listRevenueByMonth }]}
        options={chartOptions}
        height={320}
      />

      <Typography variant="h6" sx={{ textAlign: 'center', mt: 10 }}>
        Profit by month in {currentYear}
      </Typography>
      <ReactApexChart
        type="line"
        series={[{ name: 'Revenue by month', data: listProfitByMonth }]}
        options={chartOptions}
        height={320}
      />
    </>
  );
}
