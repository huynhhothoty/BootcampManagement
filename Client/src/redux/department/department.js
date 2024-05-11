import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { USER_TOKEN } from "../../util/constants/sectionStorageKey";
import axios from "axios";
import { createDepartmentAPI, updateDepartmentAPI } from "../../util/api/major/majorAPI";

const initialState = {
    loading: false,
};

export const updateDepartment =  createAsyncThunk(
    "department/updateDepartment",
    async ({departmentId, data}) => {
      try {
        const userToken = sessionStorage.getItem(USER_TOKEN);
        let res = await axios.patch(updateDepartmentAPI(departmentId), data,{
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

  export const createDepartment =  createAsyncThunk(
    "department/createDepartment",
    async (data) => {
      try {
        const userToken = sessionStorage.getItem(USER_TOKEN);
        let res = await axios.post(createDepartmentAPI(), data,{
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

export const departmentSlice = createSlice({
    name: "department",
    initialState,
    extraReducers: (builder) => {
     


    }
})

export default departmentSlice.reducer;