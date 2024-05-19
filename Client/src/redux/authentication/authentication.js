import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { changeUserPasswordAPI, loginApi, queryAllUserAPI, updateUserAPI } from "../../util/api/authentication/authenticationApi";
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

export const queryAllUser = createAsyncThunk(
  "authentication/queryAllUser",
  async (query) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(queryAllUserAPI(query), {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const updateUser = createAsyncThunk(
  "authentication/updateUser",
  async (data) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.patch(updateUserAPI(),data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "authentication/changeUserPassword",
  async (data) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.patch(changeUserPasswordAPI(),data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
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
    },
    editUserData: (state,action) => {
      const newUserData = action.payload
      state.userData = newUserData
      sessionStorage.setItem(USER_DATA,JSON.stringify(newUserData))
    }
  },
});
export const {setFirstUserData,editUserData} = authenticationSlice.actions;
export default authenticationSlice.reducer;
