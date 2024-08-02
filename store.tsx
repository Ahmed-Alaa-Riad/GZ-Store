import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './Slices/cartSlice';
import counterReducer from './Slices/CounterSlice';
const store = configureStore({
  reducer: {
    cart: cartReducer,
    counter: counterReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
