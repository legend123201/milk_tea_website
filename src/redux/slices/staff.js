import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/myCustomAxios';

// ----------------------------------------------------------------------

const initialState = {
  currentStaff: {},
  staffOfOrder: {},
  isLoading: false,
  isSuccess: null,
  errorMessage: ''
};

const slice = createSlice({
  name: 'staff',
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
      state.currentStaff = action.payload;
    },

    // GET CURRENT STAFF SUCCESS
    getCurrentStaffSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.currentStaff = action.payload;
    },

    // GET STAFF OF ORDER SUCCESS
    getStaffOfOrderSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.staffOfOrder = action.payload;
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
      const response = await axios.post('/staffs/login', loginInfo);
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

export function getStaff(isGetCurrentStaff, staffId, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/staffs/${staffId}`);
      if (isGetCurrentStaff) {
        dispatch(slice.actions.getCurrentStaffSuccess(response.data.data[0]));
      } else {
        dispatch(slice.actions.getStaffOfOrderSuccess(response.data.data[0]));
      }
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
