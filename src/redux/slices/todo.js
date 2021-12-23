import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/myCustomAxios';

// ----------------------------------------------------------------------

const initialState = {
  listData: [],
  isLoading: false,
  isSuccess: null,
  errorMessage: ''
};

const slice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload;
    },

    // GET TODOS
    getTodoListSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.listData = action.payload;
    },

    // ADD TODO
    addTodoSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    },

    // DELETE TODO
    deleteTodoSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    },

    // EDIT TODO
    editTodoSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getTodoList(myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/todos');
      dispatch(slice.actions.getTodoListSuccess(response.data.data));
    } catch (e) {
      // e sẽ tự động là response của server trả về nếu như server có trả về, còn không nó là lỗi của chương trình
      // cái điều này là do template giúp mình
      const messageError = e.message ? e.message : e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function addTodo(newTodo, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/todos', newTodo);
      dispatch(slice.actions.addTodoSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function deleteTodo(deleteId, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/todos/${deleteId}`);
      dispatch(slice.actions.deleteTodoSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function editTodo(editTodo, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/todos/${editTodo.id}`, editTodo);
      dispatch(slice.actions.editTodoSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}
