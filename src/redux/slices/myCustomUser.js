import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/myCustomAxios';

// ----------------------------------------------------------------------

const initialState = {
  listData: [],
  data: null,
  isLoading: false,
  isSuccess: null,
  errorMessage: ''
};

const slice = createSlice({
  name: 'myCustomUser',
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

    // LOGIN
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },

    // LOGOUT
    logout(state, action) {
      state.data = null;
    },

    // REGISTER
    registerSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    },

    // GET USERS
    getMyCustomUserListSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.listData = action.payload;
    },

    // GET USER
    getMyCustomUserSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },

    // DELETE USER
    deleteMyCustomUserSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    },

    // UPDATE USER
    updateMyCustomUserSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const defaultErrorString = 'Can not connect to API Server! ';

export function login(loginInfo, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/users/login', loginInfo);
      dispatch(slice.actions.loginSuccess(response.data.data[0]));
    } catch (e) {
      // e sẽ tự động là response của server trả về nếu như server có trả về, còn không nó là lỗi của chương trình
      // cái điều này là do template giúp mình
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function logout() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.logout());
  };
}

export function register(userInfo, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/users/register', userInfo);
      dispatch(slice.actions.registerSuccess());
    } catch (e) {
      // e sẽ tự động là response của server trả về nếu như server có trả về, còn không nó là lỗi của chương trình
      // cái điều này là do template giúp mình
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function getMyCustomUserList(myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/users');
      dispatch(slice.actions.getMyCustomUserListSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function getMyCustomUser(userId, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/users/${userId}`);
      dispatch(slice.actions.getMyCustomUserSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function deleteMyCustomUser(deleteId, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/users/${deleteId}`);
      dispatch(slice.actions.deleteMyCustomUserSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function updateMyCustomUser(userId, userInfo, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/users/${userId}`, userInfo);
      dispatch(slice.actions.updateMyCustomUserSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}
