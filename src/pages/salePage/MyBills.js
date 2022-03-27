/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { useTheme, styled } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box
} from '@mui/material';

import { useSnackbar } from 'notistack';
// utils
import { fDateTime } from '../../utils/formatTime';
import { fCurrency } from '../../utils/formatNumber';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMyCustomProductList, deleteMyCustomProduct } from '../../redux/slices/myCustomProduct';
import { getBillListByUserId } from '../../redux/slices/bill';
// routes
import { PATH_SALEPAGE } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  MyCustomListHead,
  MyCustomListMoreMenu,
  MyCustomListToolbar
} from '../../components/_dashboard/my-custom-list/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'datetime', label: 'Date Time', alignRight: false },
  { id: 'total', label: 'Price', alignRight: false },
  { id: 'staff_id', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// hàm này trả về cho mình "1 cái hàm"
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// hàm orderBy và filter (theo datetime của bill) của table
function applySortFilter(array, comparator, query) {
  // nếu có filter thì ưu tiên filter
  if (query) {
    // filter bằng hàm filter có sẵn có lodash, lodash mặc định xếp chữ tăng dần theo alphabet, indexOf mà khác -1 nghĩa là có tìm thấy
    return filter(array, (_myBill) => fDateTime(_myBill.datetime).toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  // không có filter mới order by
  const stabilizedThis = array.map((arrayElement, index) => [arrayElement, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    // kiểm tra nếu 2 phần tử có "giá trị mà lấy để so sánh" (orderBy) bằng nhau thì mình sắp theo index của chúng
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((stabilizedElement) => stabilizedElement[0]);
}

export default function MyBills() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.myCustomUser.data);
  const { listData } = useSelector((state) => state.bill); // lấy data list trên redux
  const [page, setPage] = useState(0); // biến giữ page hiện tại là page nào
  const [order, setOrder] = useState('asc'); // sắp xếp tăng dần hay giảm dần, mặc định mình để tăng dần
  const [orderBy, setOrderBy] = useState('a'); // biến lưu trữ đang sort theo prop nào, mặc định mình sẽ ko sort
  const [filterValue, setFilterValue] = useState(''); // biến để tìm kiếm theo value, ô search duy nhất của trang list
  const [rowsPerPage, setRowsPerPage] = useState(5); // số dòng mỗi trang
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const excuteAfterGetList = (globalStateNewest) => {
    const stateBill = globalStateNewest.bill;

    if (!stateBill.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateBill.errorMessage, { variant });
    }
  };

  useEffect(() => {
    if (currentUser) {
      dispatch(getBillListByUserId(currentUser.id, excuteAfterGetList));
    }
  }, [dispatch]);

  // sort theo prop được đưa vào hàm
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // hàm set giá trị của ô search cho biến filterValue ở trên
  const handleFilterByValue = (event) => {
    setFilterValue(event.target.value); // value này là của biến target lấy giá trị của input, chứ ko phải prop của object my custom product nhé
  };

  // bấm vào detail trên more menu
  const handleDetail = (bill_id) => {
    navigate(`${PATH_SALEPAGE.root}/my-bill-detail-list/billId/${bill_id}`);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listData.length) : 0;

  // hàm này xử lý order và filter, nhưng cả 2 ko áp dụng cùng lúc được, và filter được ưu tiên hơn
  const filteredMyBills = applySortFilter(listData, getComparator(order, orderBy), filterValue);

  const isMyBillsNotFound = filteredMyBills.length === 0;

  return (
    <Page title="My Bill: List | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Bill List"
          links={[{ name: 'Shop', href: PATH_SALEPAGE.root }, { name: 'Bill List' }]}
        />

        <Card>
          <MyCustomListToolbar filterProp={filterValue} onFilterProp={handleFilterByValue} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <MyCustomListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listData.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredMyBills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
                    const { bill_id, datetime, total, staff_id } = row;

                    return (
                      <TableRow hover key={idx} tabIndex={-1} role="checkbox">
                        <TableCell align="left">{fDateTime(datetime)}</TableCell>

                        <TableCell align="left">{fCurrency(total)}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(staff_id && 'success') || 'warning'}
                          >
                            {staff_id ? 'Verified' : 'Pending'}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <MyCustomListMoreMenu onDetail={() => handleDetail(bill_id)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isMyBillsNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterValue} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
