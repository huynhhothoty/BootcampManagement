import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { tempJWTToken } from "../../util/api/host";
import { getAllowcateByIdAPI } from "../../util/api/allowcate/allowcateApi";
import { USER_TOKEN } from "../../util/constants/sectionStorageKey";

const initialState = {
  loading: false,
  viewedAllowcatedFields: [],
  viewedAllowcatedFieldsID: "",
};
export const getAllowcatById = createAsyncThunk(
  "allowcate/getAllowcatById",
  async (allowcateId) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(getAllowcateByIdAPI(allowcateId), {
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

export const allowcateSlice = createSlice({
  name: "allocate",
  initialState,
  extraReducers: (builder) => {},
  reducers: {
    updateViewedAllocatedField: (state, action) => {
      state.viewedAllowcatedFields = action.payload.data;
      state.viewedAllowcatedFieldsID = action.payload.id;
    },
    editViewedSmallField: (state, action) => {
      let tempSmallFieldData = state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
        action.payload.smallFieldIndex
      ]
      let updatedSmallFieldData = action.payload.fieldData

      state.viewedAllowcatedFields[action.payload.fieldIndex].compulsoryCredits += updatedSmallFieldData.compulsoryCredits - tempSmallFieldData.compulsoryCredits
      state.viewedAllowcatedFields[action.payload.fieldIndex].electiveCredits += updatedSmallFieldData.electiveCredits - tempSmallFieldData.electiveCredits

      state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
        action.payload.smallFieldIndex
      ] = {...action.payload.fieldData,edited:true};
     
    },
    deleteViewedSmallField: (state,action) => {
      let tempSmallFieldData = state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
        action.payload.smallFieldIndex
      ]
      state.viewedAllowcatedFields[action.payload.fieldIndex].compulsoryCredits -= tempSmallFieldData.compulsoryCredits
      state.viewedAllowcatedFields[action.payload.fieldIndex].electiveCredits -= tempSmallFieldData.electiveCredits

      state.viewedAllowcatedFields[action.payload.fieldIndex].smallField.splice(action.payload.smallFieldIndex, 1)
    },
    updateViewedBigFieldName: (state, action) => {
      state.viewedAllowcatedFields[action.payload.index].fieldName = action.payload.fieldName
    }
  },
});
export const { updateViewedAllocatedField, editViewedSmallField, deleteViewedSmallField,updateViewedBigFieldName } =
  allowcateSlice.actions;
export default allowcateSlice.reducer;
