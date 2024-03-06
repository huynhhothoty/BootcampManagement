import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { loginApi } from "../../util/api/authentication/authenticationApi";
import { USER_DATA, USER_TOKEN } from "../../util/constants/sectionStorageKey";

const initialState = {
  userData: null,
  loading: false,
};

export const login = createAsyncThunk(
  "authentication/login",
  async (loginData) => {
    try {
      let res = await axios.post(loginApi, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
     
      if (action.payload.status === "ok") {
        const newUserData = action.payload.loginUser
        state.userData = newUserData
        sessionStorage.setItem(USER_DATA,JSON.stringify(newUserData))
        sessionStorage.setItem(USER_TOKEN,action.payload.accessToken)
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
    });
  },
  reducers: {
    setFirstUserData: (state, action) => {
        state.userData = action.payload
    }
  },
});
export const {setFirstUserData} = authenticationSlice.actions;
export default authenticationSlice.reducer;
