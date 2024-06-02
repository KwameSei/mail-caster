import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  segments: [],
  segment: null,
  isLoading: false,
  error: null,
  response: null,
};

const segmentSlice = createSlice({
  name: 'segment',
  initialState,
  reducers: {
    segmentLoading: (state) => {
      state.isLoading = true;
    },
    getSegment: (state, action) => {
      state.isLoading = false;
      state.segment = action.payload;
      state.error = null;
    },
    getSegments: (state, action) => {
      state.isLoading = false;
      state.segments = action.payload;
      state.error = null;
    },
    segmentError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    segmentResponse: (state, action) => {
      state.response = action.payload;
    },
  },
});

export const {
  segmentLoading,
  getSegment,
  getSegments,
  segmentError,
  segmentResponse,
} = segmentSlice.actions;

export const segmentReducer = segmentSlice.reducer;