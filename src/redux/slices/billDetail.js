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
  name: 'billDetail',
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

    // GET BILL DETAILS BY ID
    getBillDetailListByIdSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.listData = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const defaultErrorString = 'Can not connect to API Server! ';

export function getBillDetailListById(billId, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/billDetails/billId/${billId}`);
      dispatch(slice.actions.getBillDetailListByIdSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}
