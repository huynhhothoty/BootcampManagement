import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { USER_TOKEN } from "../../util/constants/sectionStorageKey";
import axios from "axios";
import { addBranchMajorAPI, createMajorAPI, getAllMajorAPI, getBranchMajorByIdAPI, getDepartmentByIdAPI, getMajorByIdAPI, queryAllDepartmentAPI, queryAllMajorAPI, updateBranchMajorAPI, updateMajorAPI } from "../../util/api/major/majorAPI";

const initialState = {
    loading: false,
    viewedMajor: {},
    majorList: [],
    departmentList: []
};

export const getMajorById = createAsyncThunk(
    "allowcate/getAllowcatById",
    async (majorId) => {
      try {
        const userToken = sessionStorage.getItem(USER_TOKEN);
        let res = await axios.get(getMajorByIdAPI(majorId), {
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

export const getAllMajor = createAsyncThunk(
  "allowcate/getAllMajor",
  async () => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(getAllMajorAPI(), {
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

export const updateMajor = createAsyncThunk(
  "allowcate/updateMajor",
  async ({majorId,data}) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.patch(updateMajorAPI(majorId), data, {
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

export const getDepartmentById =  createAsyncThunk(
  "allowcate/getDepartmentById",
  async (departmentId) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(getDepartmentByIdAPI(departmentId), {
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

export const queryAllDepartment =  createAsyncThunk(
  "allowcate/queryAllDepartment",
  async (query) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(queryAllDepartmentAPI(query), {
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

export const queryAllMajor = createAsyncThunk(
  "allowcate/queryAllMajor",
  async (query) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(queryAllMajorAPI(query), {
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

export const getBranchMajorById =  createAsyncThunk(
  "allowcate/getBranchMajorById",
  async (branchId) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(getBranchMajorByIdAPI(branchId), {
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

export const updateBranchMajor = createAsyncThunk(
  "allowcate/updateBranchMajor",
  async ({branchId,data}) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.patch(updateBranchMajorAPI(branchId), data, {
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

export const addBranchMajor = createAsyncThunk(
  "allowcate/addBranchMajor",
  async (data) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.post(addBranchMajorAPI(), data, {
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

export const createMajor = createAsyncThunk(
  "allowcate/createMajor",
  async (data) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.post(createMajorAPI(), data, {
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

export const majorSlice = createSlice({
    name: "major",
    initialState,
    extraReducers: (builder) => {
      builder.addCase(getMajorById.fulfilled, (state,action) => {
        state.viewedMajor = action.payload.data
      });

      builder.addCase(getAllMajor.fulfilled, (state,action) => {
        state.majorList = action.payload.data
      });


    },
    reducers: {
       updateViewedMajor: (state,action) => {
        state.viewedMajor = action.payload
       },
       updateDepartmentList: (state,action) => {
        state.departmentList = action.payload
       }
    }
})
export const {updateViewedMajor,updateDepartmentList} = majorSlice.actions;
export default majorSlice.reducer;