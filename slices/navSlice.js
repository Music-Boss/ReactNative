import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email: null,
    password: null
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers:{
        setName: (state, action) => {
            state.name = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setPassword2: (state, action) => {
            state.password2 = action.payload;
        },
        setLists: (state, action) => {
            state.lists = action.payload
        }
    }
});

export const {setName, setUsername, setEmail, setPassword, setPassword2, setLists} = navSlice.actions;

// Selectors
export const selectName = (state) => state.nav.name;

export const selectUsername = (state) => state.nav.username;

export const selectEmail = (state) => state.nav.email;

export const selectPassword = (state) => state.nav.password;

export const selectPassword2 = (state) => state.nav.password2;

export const selectLists = (state) => state.nav.lists;

export default navSlice.reducer;