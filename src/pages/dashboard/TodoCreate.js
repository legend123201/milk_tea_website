import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getTodoList } from '../../redux/slices/todo';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import TodoNewForm from '../../components/_dashboard/todo/TodoNewForm';

// ----------------------------------------------------------------------

export default function TodoCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { listData } = useSelector((state) => state.todo);
  const isEdit = pathname.includes('edit');
  const currentTodo = listData.find((todo) => Number(todo.id) === Number(id));

  useEffect(() => {
    dispatch(getTodoList());
  }, [dispatch]);

  return (
    <Page title="User: Create a new todo | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new todo' : 'Edit todo'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Todo', href: PATH_DASHBOARD.todo.root },
            { name: !isEdit ? 'New todo' : 'Edit todo' }
          ]}
        />

        <TodoNewForm isEdit={isEdit} currentTodo={currentTodo} />
      </Container>
    </Page>
  );
}
