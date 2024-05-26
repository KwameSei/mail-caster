import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  campaigns: [],
  campaign: null,
  isLoading: false,
  error: null,
  response: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    campaignLoading: (state) => {
      state.isLoading = true;
    },
    campaignLoaded: (state, action) => {
      state.isLoading = false;
      state.campaign = action.payload;
      state.error = null;
    },
    campaignsLoaded: (state, action) => {
      state.isLoading = false;
      state.campaigns = action.payload;
      state.error = null;
    },
    campaignError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    campaignResponse: (state, action) => {
      state.response = action.payload;
    },
  },
});

export const campaignReducer = campaignSlice.reducer;