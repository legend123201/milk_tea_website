/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate, useLocation, useParams } from 'react-router-dom';
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
  Box,
  Grid
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { fDateTime } from '../../utils/formatTime';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getBillDetailListById } from '../../redux/slices/billDetail';
import { getMyCustomUser } from '../../redux/slices/myCustomUser';
import { getStaff } from '../../redux/slices/staff';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
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
  { id: 'product_id', label: 'Product ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },
  { id: 'current_unit_sale_price', label: 'Current unit sale price', alignRight: false },
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

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// hàm sort của ô input search duy nhất ở trang list, ở đây mình sort theo product_id của billDetail
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_billDetail) => _billDetail.product_id.toString().toLowerCase().indexOf(query.toString().toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function BillDetailList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.myCustomUser.listData); // lấy data user trên redux
  const [approvedStaff, setApprovedStaff] = useState(null); // staff đã chấp nhận đơn hàng hiện tại
  const { listData } = useSelector((state) => state.billDetail); // lấy data list trên redux
  const [page, setPage] = useState(0); // biến giữ page hiện tại là page nào
  const [order, setOrder] = useState('asc'); // sắp xếp tăng dần hay giảm dần, mặc định mình để tăng dần
  const [selected, setSelected] = useState([]); // đây là mảng chứa id của những phần tử nào đc chọn (mảng number vì id là number)
  const [orderBy, setOrderBy] = useState('id'); // biến lưu trữ đang sort theo prop nào, mặc định mình sẽ để là id
  const [filterValue, setFilterValue] = useState(''); // biến để tìm kiếm theo value, ô search duy nhất của trang list
  const [rowsPerPage, setRowsPerPage] = useState(5); // số dòng mỗi trang
  const [totalOfOrder, setTotalOfOrder] = useState(0); // giá tiền tổng của đơn hàng

  const { id } = useParams();
  const { userId } = useParams();
  let { staffId } = useParams();
  staffId = Number(staffId); // mình cần làm thế này vì staffId nếu là null thì param nó là string 'null' (truthy value) chứ ko phải là null thật
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false); // điều khiển tắt mở dialog

  // mở dialog
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  // đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const excuteAfterGetList = (globalStateNewest) => {
    if (!globalStateNewest.billDetail.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(globalStateNewest.billDetail.errorMessage, { variant });
    }
  };

  const excuteAfterGetUser = (globalStateNewest) => {
    if (!globalStateNewest.myCustomUser.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(globalStateNewest.myCustomUser.errorMessage, { variant });
    }
  };

  // hàm này chỉ chạy khi đang xem detail
  const excuteAfterGetApprovedStaff = (globalStateNewest) => {
    if (!globalStateNewest.staff.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(globalStateNewest.staff.errorMessage, { variant });
      setApprovedStaff(null);
    } else {
      setApprovedStaff(globalStateNewest.staff.staffOfOrder);
    }
  };

  // const excuteAfterAddImportOrder = (globalStateNewest) => {
  //   if (!globalStateNewest.importOrder.isSuccess) {
  //     const variant = 'error';
  //     // variant could be success, error, warning, info, or default
  //     enqueueSnackbar(globalStateNewest.importOrderDetail.errorMessage, { variant });
  //   } else {
  //     const variant = 'success';
  //     // variant could be success, error, warning, info, or default
  //     enqueueSnackbar('Create success', { variant });
  //     navigate(PATH_DASHBOARD.importOrder.list);
  //   }
  // };

  // lấy danh sách bill detail và user của bill
  useEffect(() => {
    dispatch(getBillDetailListById(id, excuteAfterGetList));
    dispatch(getMyCustomUser(userId, excuteAfterGetUser));
  }, [dispatch]);

  // lấy thông tin người đã chấp nhận đơn, nếu chưa có ai thì vẫn để null
  useEffect(() => {
    if (staffId) {
      dispatch(getStaff(false, staffId, excuteAfterGetApprovedStaff));
    }
  }, []);

  useEffect(() => {
    const newTotal = listData.reduce(
      (total, value, index) => total + value.quantity * value.current_unit_sale_price,
      0
    );
    setTotalOfOrder(newTotal);
  }, [listData]);

  // sort theo prop được đưa vào hàm
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // cái này là event cho ô checkbox tổng
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listData.map((n) => n.product_id); // lấy tất cả phần tử
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // hàm set cái mảng những phần tử đang đc chọn
  const handleClick = (event, product_id) => {
    // xài indexOf cho mảng string hoặc number cực kì tối ưu
    const selectedIndex = selected.indexOf(product_id); // vị trí của phần tử vừa click
    let newSelected = [];

    // nếu index là -1 nghĩa là ko kiếm thấy, vậy đơn giản mình thêm product_id vào mảng chứa những product_id đang đc chọn
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, product_id);
    } else if (selectedIndex === 0) {
      /* 
      từ else if này đổ xuống nghĩa là mình có kiếm thấy, vậy đang có mà click chọn thì sẽ bỏ chọn, vậy những dòng lệnh 
      phía dưới là để loại 1 phần tử ra khỏi mảng, rất hay để học hỏi
      */
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
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
    setFilterValue(event.target.value); // value này là của biến target lấy giá trị của input, chứ ko phải prop của object import order nhé
  };

  const handleSubmitOrder = () => {
    // if (listData.length === 0) {
    //   const variant = 'error';
    //   // variant could be success, error, warning, info, or default
    //   enqueueSnackbar('Import has no product!', { variant });
    // } else {
    //   dispatch(addImportOrder(currentStaff.id, listData, excuteAfterAddImportOrder));
    // }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listData.length) : 0;

  const filteredBillDetails = applySortFilter(listData, getComparator(order, orderBy), filterValue);

  const isBillDetailNotFound = filteredBillDetails.length === 0;

  return (
    <Page title="Bill Detail: List | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Bill Detail List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Bill', href: PATH_DASHBOARD.bill.root },
            { name: 'Detail' }
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h4" noWrap align="center">
                Bill Detail
              </Typography>
              <Typography variant="body1" noWrap sx={{ mt: 2 }}>
                User ID: {user ? user.id : ''}
              </Typography>
              <Typography variant="body1" noWrap sx={{ mt: 2 }}>
                User Name: {user ? user.name : ''}
              </Typography>
              <Typography variant="body1" noWrap sx={{ mt: 2 }}>
                Staff ID: {approvedStaff ? approvedStaff.id : ''}
              </Typography>
              <Typography variant="body1" noWrap sx={{ mt: 2 }}>
                Staff Name: {approvedStaff ? approvedStaff.name : ''}
              </Typography>
              <Typography variant="body1" noWrap sx={{ mt: 2 }}>
                Total: {totalOfOrder}
              </Typography>
              <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                {!staffId && (
                  <Button variant="contained" size="large" color="info" onClick={handleSubmitOrder}>
                    Approve Bill
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <Card>
              <MyCustomListToolbar
                numSelected={selected.length}
                filterProp={filterValue}
                onFilterProp={handleFilterByValue}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <MyCustomListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={listData.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredBillDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { product_id, name, quantity, current_unit_sale_price } = row;
                        const isItemSelected = selected.indexOf(product_id) !== -1;

                        return (
                          <TableRow
                            hover
                            key={product_id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, product_id)} />
                            </TableCell>

                            <TableCell align="left">{product_id}</TableCell>
                            <TableCell align="left">{name}</TableCell>
                            <TableCell align="left">{quantity}</TableCell>
                            <TableCell align="left">{current_unit_sale_price}</TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    {isBillDetailNotFound && (
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
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
