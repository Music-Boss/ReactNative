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
        },
        setSongs: (state, action) => {
            state.songs = action.payload
        },
        setNList: (state, action) => {
            state.nList = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setUserId: (state, action) => {
            state.userid = action.payload
        },
        setAllLists: (state, action) => {
            state.allLists = action.payload
        }, 
        setEditList: (state, action) => {
            state.editList = action.payload
        },
        setSongsList: (state, action) => {
            state.songsList = action.payload
        },
        setView: (state, action) => {
            state.currView = action.payload
        }, 
        setNoUser: (state, action) => {
            state.noUser = action.payload
        }, 
    }
});

export const {  setName, 
                setUsername, 
                setEmail, 
                setPassword, 
                setPassword2, 
                setLists, 
                setSongs, 
                setNList, 
                setToken, 
                setUserId, 
                setAllLists, 
                setEditList, 
                setSongsList,
                setView,
                setNoUser} = navSlice.actions;

// Selectors
export const selectName = (state) => state.nav.name;

export const selectUsername = (state) => state.nav.username;

export const selectEmail = (state) => state.nav.email;

export const selectPassword = (state) => state.nav.password;

export const selectPassword2 = (state) => state.nav.password2;

export const selectLists = (state) => state.nav.lists;

export const selectSongs = (state) => state.nav.songs;

export const selectToken = (state) => state.nav.token;

export const selectUserId = (state) => state.nav.userid;

export const selectAllLists = (state) => state.nav.allLists;

export const selectEditList = (state) => state.nav.editList;

export const selectSongsList = (state) => state.nav.songsList;

export const selectView = (state) => state.nav.view;

export const selectNoUser = (state) => state.nav.noUser;

export default navSlice.reducer;