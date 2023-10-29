import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { tempJWTToken } from "../../util/api/host";
import {
  getAllBootcampAPI,
  getBootcampByUserIDAPI,
} from "../../util/api/bootcamp/bootcampApi";
import { USER_DATA, USER_TOKEN } from "../../util/constants/sectionStorageKey";

const initialState = {
  bootcampList: [],
  userBootcampList: [],
  loading: false,
  viewedBootcamp: {}
};

export const getAllBootcamp = createAsyncThunk(
  "bootcamp/getAllBootcamp",
  async () => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(getAllBootcampAPI("2023"), {
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

export const getBootcampsByUserID = createAsyncThunk(
  "bootcamp/getbootcampbyuserid",
  async () => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let userData = sessionStorage.getItem(USER_DATA);
      userData = JSON.parse(userData)
      let res = await axios.get(getBootcampByUserIDAPI(userData.id), {
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

export const bootcampSlice = createSlice({
  name: "bootcamp",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllBootcamp.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllBootcamp.fulfilled, (state, action) => {
      state.bootcampList = action.payload.data.map((bootcamp) => {
        return {
          ...bootcamp,
          key: bootcamp._id,
        };
      });
      state.loading = false;
    });
    builder.addCase(getAllBootcamp.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getBootcampsByUserID.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getBootcampsByUserID.fulfilled, (state, action) => {
      state.userBootcampList = action.payload.data.map((bootcamp) => {
        return {
          ...bootcamp,
          key: bootcamp._id,
        };
      });
      state.loading = false;
    });
    builder.addCase(getBootcampsByUserID.rejected, (state, action) => {
      state.loading = false;
    });
  },
  reducers: {
    updateViewedBootcamp: (state, action) => {
      state.viewedBootcamp = action.payload
    }
  },
});
export const {updateViewedBootcamp} = bootcampSlice.actions;
export default bootcampSlice.reducer;
