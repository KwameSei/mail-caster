import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userSlice';
import { campaignReducer } from './campaignSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    campaign: campaignReducer,
  },
});

export default store;