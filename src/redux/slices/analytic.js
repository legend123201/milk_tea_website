import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/myCustomAxios';

// ----------------------------------------------------------------------

const initialState = {
  totalUser: 0,
  totalBill: 0,
  listRevenueByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  isLoading: false,
  isSuccess: null,
  errorMessage: ''
};

const slice = createSlice({
  name: 'analytic',
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

    // GET TOTAL USER
    getTotalUserSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.totalUser = action.payload;
    },

    // GET TOTAL BILL
    getTotalBillSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.totalBill = action.payload;
    },

    // GET LIST REVENUE BY MONTH
    getListRevenueByMonthSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.listRevenueByMonth = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const defaultErrorString = 'Can not connect to API Server! ';

export function getTotalUser(myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/analytics/user`);
      console.log(response);
      dispatch(slice.actions.getTotalUserSuccess(response.data.data[0].totalUser));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function getTotalBill(myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/analytics/bill`);
      dispatch(slice.actions.getTotalBillSuccess(response.data.data[0].totalBill));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function getListRevenueByMonth(myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/analytics/revenue`);
      dispatch(slice.actions.getListRevenueByMonthSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}
