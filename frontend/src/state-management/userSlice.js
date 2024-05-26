import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    users: [],
    token: localStorage.getItem('token') || null,
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    currentRole: (JSON.parse(localStorage.getItem('isAdmin')) || {}).role || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    response: null,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLoading: (state) => {
            state.isLoading = true;
        },
        userAuth: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.currentUser = action.payload.user;
            state.currentRole = action.payload.user.role;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        usersAuth: (state, action) => {
            state.isLoading = false;
            state.users = action.payload;
            state.error = null;
            state.response = null;
        },
        userError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        authError: (state, action) => {
            state.error = action.payload;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        userLogout: (state) => {
            state.user = null;
            state.token = null;
            state.currentUser = null;
            state.currentRole = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        userUpdate: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        userResponse: (state, action) => {
            state.response = action.payload;
        },
    },
});

export const {
    userLoading,
    userAuth,
    usersAuth,
    userError,
    authError,
    userLogout,
    userUpdate,
    userResponse,
} = userSlice.actions;

export const userReducer = userSlice.reducer;