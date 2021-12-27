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

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMyCustomProductList, deleteMyCustomProduct } from '../../redux/slices/myCustomProduct';
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
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'quantity_in_stock', label: 'Quantity in stock', alignRight: false },
  { id: 'unit_perchase_price', label: 'Unit perchase price', alignRight: false },
  { id: 'unit_sale_price', label: 'Unit sale price', alignRight: false },
  { id: 'measure_unit', label: 'Measure unit', alignRight: false },
  { id: '' }
];

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

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

// hàm sort của ô input search duy nhất ở trang list, ở đây mình sort theo name của my custom product
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
      (_myCustomProduct) => _myCustomProduct.name.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function MyCustomProductList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { listData } = useSelector((state) => state.myCustomProduct); // lấy data list trên redux
  const [page, setPage] = useState(0); // biến giữ page hiện tại là page nào
  const [order, setOrder] = useState('asc'); // sắp xếp tăng dần hay giảm dần, mặc định mình để tăng dần
  const [selected, setSelected] = useState([]); // đây là mảng chứa id của những phần tử nào đc chọn (mảng number vì id là number)
  const [orderBy, setOrderBy] = useState('id'); // biến lưu trữ đang sort theo prop nào, mặc định mình sẽ để là id
  const [filterValue, setFilterValue] = useState(''); // biến để tìm kiếm theo value, ô search duy nhất của trang list
  const [rowsPerPage, setRowsPerPage] = useState(5); // số dòng mỗi trang
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const excuteAfterGetList = (globalStateNewest) => {
    if (!globalStateNewest.myCustomProduct.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(globalStateNewest.myCustomProduct.errorMessage, { variant });
    }
  };

  const excuteAfterDelete = (globalStateNewest) => {
    if (globalStateNewest.myCustomProduct.isSuccess) {
      const variant = 'success';
      enqueueSnackbar('Delete success', { variant });
      dispatch(getMyCustomProductList(excuteAfterGetList));
    } else {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(globalStateNewest.myCustomProduct.errorMessage, { variant });
    }
  };

  useEffect(() => {
    dispatch(getMyCustomProductList(excuteAfterGetList));
  }, [dispatch]);

  // sort theo prop được đưa vào hàm
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // cái này là event cho ô checkbox tổng
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listData.map((n) => n.id); // lấy tất cả phần tử
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // hàm set cái mảng những phần tử đang đc chọn
  const handleClick = (event, id) => {
    // xài indexOf cho mảng string hoặc number cực kì tối ưu
    const selectedIndex = selected.indexOf(id); // vị trí của phần tử vừa click
    let newSelected = [];

    // nếu index là -1 nghĩa là ko kiếm thấy, vậy đơn giản mình thêm id vào mảng chứa những id đang đc chọn
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    setFilterValue(event.target.value); // value này là của biến target lấy giá trị của input, chứ ko phải prop của object my custom product nhé
  };

  // bấm vào delete trên more menu hàm gọi api xóa
  const handleDelete = (id) => {
    dispatch(deleteMyCustomProduct(id, excuteAfterDelete));
  };

  // bấm vào edit trên more menu
  const handleEdit = (id) => {
    navigate(`${PATH_DASHBOARD.myCustomProduct.root}/${id}/edit`);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listData.length) : 0;

  const filteredMyCustomProducts = applySortFilter(listData, getComparator(order, orderBy), filterValue);

  const isMyCustomProductNotFound = filteredMyCustomProducts.length === 0;

  return (
    <Page title="Product: List | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product', href: PATH_DASHBOARD.myCustomProduct.root },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.myCustomProduct.newMyCustomProduct}
              startIcon={<Icon icon={plusFill} />}
            >
              New Product
            </Button>
          }
        />

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
                  {filteredMyCustomProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, quantity_in_stock, unit_perchase_price, unit_sale_price, measure_unit, image } =
                      row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        <TableCell align="left">{id}</TableCell>
                        <TableCell component="th" scope="row" padding="none" style={{ padding: 0 }}>
                          <Box
                            sx={{
                              py: 2,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ThumbImgStyle alt={name} src={image} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">{quantity_in_stock}</TableCell>
                        <TableCell align="left">{unit_perchase_price}</TableCell>
                        <TableCell align="left">{unit_sale_price}</TableCell>
                        <TableCell align="left">{measure_unit}</TableCell>

                        <TableCell align="right">
                          <MyCustomListMoreMenu onDelete={() => handleDelete(id)} onEdit={() => handleEdit(id)} />
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
                {isMyCustomProductNotFound && (
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
