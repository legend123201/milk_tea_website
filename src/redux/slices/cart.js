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
  name: 'cart',
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

    // GET CARTS
    getCartListSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.listData = action.payload;
    },

    // ADD CART SUCCESS
    addCartSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    },

    // ADD CART SUCCESS
    deleteCartSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    },

    // UPDATE CART SUCCESS
    updateCartSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const defaultErrorString = 'Can not connect to API Server! ';

export function getCartList(userId, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/carts/userId/${userId}`);
      dispatch(slice.actions.getCartListSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function addCart(newCart, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/carts', newCart);
      dispatch(slice.actions.addCartSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function deleteCart(userId, productId, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/carts/userId/${userId}/productId/${productId}`);
      dispatch(slice.actions.deleteCartSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function updateCart(updateCart, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(
        `/carts/userId/${updateCart.userId}/productId/${updateCart.productId}`,
        updateCart
      );
      dispatch(slice.actions.updateCartSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}
