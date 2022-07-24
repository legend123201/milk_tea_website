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
// utils
import { fDateTime } from '../../utils/formatTime';
import { fCurrency, fNumber } from '../../utils/formatNumber';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getImportOrderDetailListByImportOrderId } from '../../redux/slices/importOrderDetail';
import { addImportOrder } from '../../redux/slices/importOrder';
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
import ImportOrderDetailNewFormDialog from '../../components/_dashboard/importOrderDetail/ImportOrderDetailNewFormDialog';
import MyCustomAlertDialog from '../../components/MyCustomAlertDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'productId', label: 'Product ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },
  { id: 'currentUnitPerchasePrice', label: 'Current unit perchase price (vnd)', alignRight: false },
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

// hàm orderBy và filter (theo name của product) của table
function applySortFilter(array, comparator, query) {
  // nếu có filter thì ưu tiên filter
  if (query) {
    // filter bằng hàm filter có sẵn có lodash, lodash mặc định xếp chữ tăng dần theo alphabet, indexOf mà khác -1 nghĩa là có tìm thấy
    return filter(
      array,
      (_importOrderDetail) =>
        _importOrderDetail.product.name.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
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

export default function ImportOrderDetailList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentStaff = useSelector((state) => state.staff.currentStaff); // staff đang sử dụng chương trình
  const [orderMaker, setOrderMaker] = useState(null); // staff của đơn hàng hiện tại
  const [listData, setListData] = useState([]); // khởi tạo mảng chứa các chi tiết là rỗng
  const [page, setPage] = useState(0); // biến giữ page hiện tại là page nào
  const [order, setOrder] = useState('asc'); // sắp xếp tăng dần hay giảm dần, mặc định mình để tăng dần
  const [selected, setSelected] = useState([]); // đây là mảng chứa id của những phần tử nào đc chọn (mảng number vì id là number)
  const [orderBy, setOrderBy] = useState('id'); // biến lưu trữ đang sort theo prop nào, mặc định mình sẽ để là id
  const [filterValue, setFilterValue] = useState(''); // biến để tìm kiếm theo value, ô search duy nhất của trang list
  const [rowsPerPage, setRowsPerPage] = useState(5); // số dòng mỗi trang
  const [totalOfOrder, setTotalOfOrder] = useState(0); // giá tiền tổng của đơn hàng
  const { pathname } = useLocation();
  const isDetail = pathname.includes('detail');
  const { id } = useParams();
  const { staffOfOrderId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openDialogAddProduct, setOpenDialogAddProduct] = useState(false); // điều khiển tắt mở dialog
  const [openDialogCreateImportOrder, setOpenDialogCreateImportOrder] = useState(false);

  // mở dialog
  const handleClickOpenDialogAddProduct = () => {
    setOpenDialogAddProduct(true);
  };

  const handleClickOpenDialogCreateImportOrder = () => {
    setOpenDialogCreateImportOrder(true);
  };

  // đóng dialog
  const handleCloseDialogAddProduct = () => {
    setOpenDialogAddProduct(false);
  };

  const handleCloseDialogCreateImportOrder = () => {
    setOpenDialogCreateImportOrder(false);
  };

  // hàm này chỉ chạy khi đang xem detail
  const excuteAfterGetList = (globalStateNewest) => {
    const stateImportOrderDetail = globalStateNewest.importOrderDetail;
    if (!stateImportOrderDetail.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateImportOrderDetail.errorMessage, { variant });
    } else {
      setListData(stateImportOrderDetail.listData);
    }
  };

  // hàm này chỉ chạy khi đang xem detail
  const excuteAfterGetStaffOfOrder = (globalStateNewest) => {
    const stateStaff = globalStateNewest.staff;
    if (!stateStaff.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateStaff.errorMessage, { variant });
    } else {
      setOrderMaker(stateStaff.staffOfOrder);
    }
  };

  const excuteAfterAddImportOrder = (globalStateNewest) => {
    const stateImportOrder = globalStateNewest.importOrder;
    if (!stateImportOrder.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateImportOrder.errorMessage, { variant });
    } else {
      const variant = 'success';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('Create success', { variant });
      navigate(PATH_DASHBOARD.importOrder.list);
    }
  };

  // khởi tạo mảng listData, nếu như đang xem detail thì lấy danh sách từ api về, ko thì là rỗng
  useEffect(() => {
    if (isDetail) {
      dispatch(getImportOrderDetailListByImportOrderId(id, excuteAfterGetList));
    } else {
      setListData([]);
    }
  }, [dispatch]);

  // đồng thời nếu đang xem detail thì staff sẽ làm người làm đơn hàng, còn đang tạo mới thì của staff hiện tại
  useEffect(() => {
    if (isDetail) {
      dispatch(getStaff(false, staffOfOrderId, excuteAfterGetStaffOfOrder));
    } else {
      setOrderMaker(currentStaff);
    }
  }, [dispatch, currentStaff]);

  useEffect(() => {
    const newTotal = listData.reduce(
      (total, value, index) => total + value.quantity * value.currentUnitPerchasePrice,
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

  // bấm vào delete trên more menu
  const handleDelete = (id) => {
    setListData(listData.filter((item) => Number(item.product.id) !== Number(id)));
    const variant = 'success';
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('Delete success', { variant });
  };

  // ktra có trùng product trong danh sách ko
  const isDuplicateProduct = (detail) => {
    const duplicateProduct = listData.find((item) => Number(item.product.id) === Number(detail.productId));
    if (duplicateProduct) {
      return true;
    }
    return false;
  };

  // thêm detail vào danh sách
  const handleAddDetail = (newImportOrderDetail) => {
    const formatForApi = {
      quantity: newImportOrderDetail.quantity,
      currentUnitPerchasePrice: newImportOrderDetail.currentUnitPerchasePrice,
      product: {
        id: newImportOrderDetail.productId,
        name: newImportOrderDetail.name
      }
    };
    setListData([...listData, formatForApi]);
  };

  const handleSubmitOrder = () => {
    if (listData.length === 0) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('Import has no product!', { variant });
    } else if (currentStaff) {
      dispatch(addImportOrder(currentStaff.id, listData, excuteAfterAddImportOrder));
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listData.length) : 0;

  const filteredImportOrderDetails = applySortFilter(listData, getComparator(order, orderBy), filterValue);

  const isImportOrderDetailNotFound = filteredImportOrderDetails.length === 0;

  return (
    <Page title="Import Order Detail: List | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Import Order Detail List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Import Order', href: PATH_DASHBOARD.importOrder.root },
            { name: isDetail ? 'Detail' : 'Create' }
          ]}
          action={
            !isDetail && (
              <Button
                variant="contained"
                onClick={handleClickOpenDialogAddProduct}
                startIcon={<Icon icon={plusFill} />}
              >
                New Import Order Detail
              </Button>
            )
          }
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h4" noWrap align="center">
                Order Detail
              </Typography>
              <Typography variant="body1" noWrap sx={{ mt: 2 }}>
                Staff ID: {orderMaker ? orderMaker.id : ''}
              </Typography>
              <Typography variant="body1" noWrap sx={{ mt: 2 }}>
                Name: {orderMaker ? orderMaker.name : ''}
              </Typography>
              <Typography variant="body1" noWrap sx={{ mt: 2 }}>
                Total: {fNumber(totalOfOrder)} vnd
              </Typography>
              <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                {!isDetail && currentStaff && (
                  <Button
                    variant="contained"
                    size="large"
                    color="info"
                    onClick={handleClickOpenDialogCreateImportOrder}
                  >
                    Submit Order
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <Card>
              <MyCustomListToolbar
                filterProp={filterValue}
                onFilterProp={handleFilterByValue}
                searchPlaceholder="Search by product name"
              />

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
                      {filteredImportOrderDetails
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { product, quantity, currentUnitPerchasePrice } = row;

                          return (
                            <TableRow hover key={product.id} tabIndex={-1} role="checkbox">
                              <TableCell align="left">{product.id}</TableCell>
                              <TableCell align="left">{product.name}</TableCell>
                              <TableCell align="left">{fNumber(quantity)}</TableCell>
                              <TableCell align="left">{fNumber(currentUnitPerchasePrice)}</TableCell>
                              <TableCell align="right">
                                {!isDetail && <MyCustomListMoreMenu onDelete={() => handleDelete(product.id)} />}
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
                    {isImportOrderDetailNotFound && (
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
      <ImportOrderDetailNewFormDialog
        open={openDialogAddProduct}
        handleCloseDialog={handleCloseDialogAddProduct}
        isDuplicateProduct={isDuplicateProduct}
        handleAgree={handleAddDetail}
      />
      <MyCustomAlertDialog
        title="Verifying"
        contentText="Are you sure you want to create import order?"
        open={openDialogCreateImportOrder}
        handleCloseDialog={handleCloseDialogCreateImportOrder}
        handleAgree={handleSubmitOrder}
      />
    </Page>
  );
}
