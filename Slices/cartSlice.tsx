import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Product} from '../screens/ProductDetail';

interface cartState {
  cartList: Product[];
  count: number;
}
const initialState: cartState = {
  cartList: [],
  count: 1,
};
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existedProduct = state.cartList.find(
        (item: Product) => item.id === action.payload.id,
      );
      if (existedProduct?.quantity && existedProduct?.count) {
        existedProduct.count += 1;
        existedProduct.quantity += 1;
      } else {
        state.cartList.push({...action.payload, count: 1, quantity: 1});
      }
    },
    productCount: (
      state,
      action: PayloadAction<{id: number; count: number}>,
    ) => {
      const product = state.cartList.find(
        item => item.id === action.payload.id,
      );
      if (product) {
        product.count = action.payload.count;
      }
    },
    removeFromCart: (state, action: PayloadAction<{id: number}>) => {
      const prod = state.cartList.find(item => item.id === action.payload.id);
      if (prod) {
        if (prod.count === 1) {
          state.cartList = state.cartList.filter(
            item => item.id !== action.payload.id,
          );
        } else {
          if (prod.count) {
            prod.count -= 1;
          }
        }
        state.count -= 1;
      }
    },
    deleteFromCart: (state, action: PayloadAction<{id: number}>) => {
      const prod = state.cartList.find(item => item.id === action.payload.id);
      if (prod) {
        state.cartList = state.cartList.filter(
          item => item.id !== action.payload.id,
        );
      }
    },
    emptyCart: state => {
      state.cartList = [];
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  productCount,
  deleteFromCart,
  emptyCart,
} = cartSlice.actions;
export const selectTotalQuantity = createSelector(
  (state: RootState) => state.cart.cartList,
  cartList => cartList.reduce((acc, cur) => acc + Number(cur.count), 0),
);
export default cartSlice.reducer;
