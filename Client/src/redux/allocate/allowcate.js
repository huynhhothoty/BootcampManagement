import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { tempJWTToken } from "../../util/api/host";
import { getAllowcateByIdAPI, updateAllowcateAPI } from "../../util/api/allowcate/allowcateApi";
import { USER_TOKEN } from "../../util/constants/sectionStorageKey";
import { SUBJECT_ADDED_IMPORT, SUBJECT_ADDED_NORMAL, SUBJECT_EDITED } from "../../util/constants/subjectStatus";

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

export const updateAllowcate = createAsyncThunk(
  "allowcate/updateAllowcated",
  async ({allowcateId,fieldData}) => {
    console.log(fieldData)
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.patch(updateAllowcateAPI(allowcateId),fieldData, {
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
      let tempSmallFieldData =
        state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
          action.payload.smallFieldIndex
        ];
      let updatedSmallFieldData = action.payload.fieldData;

      state.viewedAllowcatedFields[
        action.payload.fieldIndex
      ].compulsoryCredits +=
        updatedSmallFieldData.compulsoryCredits -
        tempSmallFieldData.compulsoryCredits;
      state.viewedAllowcatedFields[action.payload.fieldIndex].electiveCredits +=
        updatedSmallFieldData.electiveCredits -
        tempSmallFieldData.electiveCredits;

      state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
        action.payload.smallFieldIndex
      ] = { ...action.payload.fieldData, edited: true };
    },
    deleteViewedSmallField: (state, action) => {
      let tempSmallFieldData =
        state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
          action.payload.smallFieldIndex
        ];
      state.viewedAllowcatedFields[
        action.payload.fieldIndex
      ].compulsoryCredits -= tempSmallFieldData.compulsoryCredits;
      state.viewedAllowcatedFields[action.payload.fieldIndex].electiveCredits -=
        tempSmallFieldData.electiveCredits;

      state.viewedAllowcatedFields[action.payload.fieldIndex].smallField.splice(
        action.payload.smallFieldIndex,
        1
      );
    },
    updateViewedBigFieldName: (state, action) => {
      state.viewedAllowcatedFields[action.payload.index].fieldName =
        action.payload.fieldName;
    },
    addToViewedFields: (state, action) => {

      state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList.push(
        {
          ...action.payload.subject,
          status: [SUBJECT_ADDED_NORMAL]
        }
      );
    },
    editSubjestViewedFields: (state, action) => {
    
        state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[action.payload.subjectIndex] = {
          ...action.payload.subject
        }
    
        
    },
    addSmallFieldToViewedFields: (state, action) => {
      state.viewedAllowcatedFields[action.payload].smallField.push({
        compulsoryCredits: 0,
        electiveCredits: 0,
        fieldName: ""
      })
    },
    addBigFieldToViewedFields: (state, action) => {
      state.viewedAllowcatedFields.push({
        compulsoryCredits: 0,
        electiveCredits: 0,
        fieldName: "",
        smallField: [],
        subjectList: [],
        electiveSubjectList:[]
      })
    },
    deleteBigFieldFromViewedFields: (state, action) => {
      state.viewedAllowcatedFields.splice(action.payload,1)
    },
    deleteSubjectFromViewedFields: (state, action) => {
      state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList.splice(action.payload.subjectIndex, 1)
    },
    addNewElectiveGroupToViewedField: (state, action) => {
      state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList.push(action.payload.groupData)
    },
    editElectiveGroupToViewedField: (state, action) => {
      state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList[action.payload.groupIndex] = action.payload.groupData
    },
    deleteElectiveGroupToViewedField: (state, action) => {
      state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList.splice(action.payload.groupIndex, 1)
    },
    updateAllowcateSubjectListSemester: (state,action) => {
      action.payload.forEach((subject) => {
        state.viewedAllowcatedFields[subject.fieldIndex].subjectList[subject.subjectIndex]['semester'] = subject.semester
      })
     
    }
  },
});
export const {
  updateViewedAllocatedField,
  editViewedSmallField,
  deleteViewedSmallField,
  updateViewedBigFieldName,
  addToViewedFields,
  editSubjestViewedFields,
  addSmallFieldToViewedFields,
  addBigFieldToViewedFields,
  deleteBigFieldFromViewedFields,
  deleteSubjectFromViewedFields,
  addNewElectiveGroupToViewedField,
  editElectiveGroupToViewedField,
  deleteElectiveGroupToViewedField,
  updateAllowcateSubjectListSemester
} = allowcateSlice.actions;
export default allowcateSlice.reducer;
