import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { USER_TOKEN } from "../../util/constants/sectionStorageKey";
import axios from "axios";
import { addTeacherAPI, queryAllTeacherAPI, updateTeacherAPI } from "../../util/api/teacher/teacherAPI";

const initialState = {
  loading: false,
};
export const queryAllTeacher = createAsyncThunk(
  "teacher/queryAllTeacher",
  async (query) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(queryAllTeacherAPI(query), {
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

export const updateTeacherData = createAsyncThunk(
  "teacher/updateTeacherData",
  async ({ teacherId, data }) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.patch(updateTeacherAPI(teacherId), data, {
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

export const addTeacher = createAsyncThunk(
  "teacher/addTeacher",
  async (data) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.post(addTeacherAPI(), data, {
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

export const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  extraReducers: (builder) => {},
  reducers: {},
});
export const {} = teacherSlice.actions;
export default teacherSlice.reducer;
