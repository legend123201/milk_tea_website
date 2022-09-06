import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/myCustomAxios';

// ----------------------------------------------------------------------

const initialState = {
  listData: [],
  listNewestData: [],
  listBestSellingData: [],
  data: null,
  isLoading: false,
  isSuccess: null,
  errorMessage: ''
};

const slice = createSlice({
  name: 'myCustomProduct',
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

    // GET PRODUCTS
    getMyCustomProductListSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.listData = action.payload;
    },

    // GET NEWEST PRODUCTS
    getNewestMyCustomProductListSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.listNewestData = action.payload;
    },

    // GET BEST SELLING PRODUCTS
    getBestSellingMyCustomProductListSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.listBestSellingData = action.payload;
    },

    // GET PRODUCT
    getMyCustomProductSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },

    // ADD PRODUCTS
    addMyCustomProductSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    },

    // DELETE PRODUCTS
    deleteMyCustomProductSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    },

    // EDIT PRODUCTS
    editMyCustomProductSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const defaultErrorString = 'Can not connect to API Server! ';

export function getMyCustomProductList(myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/products');
      dispatch(slice.actions.getMyCustomProductListSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function getNewestMyCustomProductList(myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/products/newest');
      dispatch(slice.actions.getNewestMyCustomProductListSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function getBestSellingMyCustomProductList(myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/products/bestselling');
      dispatch(slice.actions.getBestSellingMyCustomProductListSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function getMyCustomProduct(id, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/products/${id}`);
      dispatch(slice.actions.getMyCustomProductSuccess(response.data.data));
    } catch (e) {
      console.log(e);
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function addMyCustomProduct(newMyCustomProduct, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const body = {
        ...newMyCustomProduct,
        category: {
          id: newMyCustomProduct.categoryId
        }
      };
      const response = await axios.post('/products', body);
      dispatch(slice.actions.addMyCustomProductSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function deleteMyCustomProduct(deleteId, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/products/${deleteId}`);
      dispatch(slice.actions.deleteMyCustomProductSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}

export function editMyCustomProduct(editMyCustomProduct, myCallBack) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const body = {
        ...editMyCustomProduct,
        category: {
          id: editMyCustomProduct.categoryId
        }
      };
      const response = await axios.put(`/products/${editMyCustomProduct.id}`, body);
      dispatch(slice.actions.editMyCustomProductSuccess());
    } catch (e) {
      const messageError = e.message ? e.message : defaultErrorString + e.toString();
      dispatch(slice.actions.hasError(messageError));
    } finally {
      if (myCallBack) myCallBack(getState());
    }
  };
}
