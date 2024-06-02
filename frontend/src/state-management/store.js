import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userSlice';
import { campaignReducer } from './campaignSlice';
import { segmentReducer } from './segmentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    campaign: campaignReducer,
    segment: segmentReducer
  },
});

export default store;