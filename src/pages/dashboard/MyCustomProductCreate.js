import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMyCustomProductList } from '../../redux/slices/myCustomProduct';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import MyCustomProductNewForm from '../../components/_dashboard/myCustomProduct/MyCustomProductNewForm';

// ----------------------------------------------------------------------

export default function MyCustomProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { listData } = useSelector((state) => state.myCustomProduct);
  const isEdit = pathname.includes('edit');
  const currentMyCustomProduct = listData.find((myCustomProduct) => Number(myCustomProduct.id) === Number(id));

  useEffect(() => {
    dispatch(getMyCustomProductList());
  }, [dispatch]);

  return (
    <Page title="User: Create a new product | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product', href: PATH_DASHBOARD.myCustomProduct.root },
            { name: !isEdit ? 'New product' : 'Edit product' }
          ]}
        />

        <MyCustomProductNewForm isEdit={isEdit} currentMyCustomProduct={currentMyCustomProduct} />
      </Container>
    </Page>
  );
}
