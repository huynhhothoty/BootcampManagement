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

        state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
          action.payload.smallFieldIndex
        ].fieldName = action.payload.fieldData?.fieldName

      state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
        action.payload.smallFieldIndex
      ]['edited'] = true
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
      state.viewedAllowcatedFields.splice(state.viewedAllowcatedFields.length - 1, 0,{
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
     
    },
    updateViewedSmallFieldCompulsoryCredits: (state, action) => {
      if (action.payload.subject.isCompulsory) {
        if (action.payload.subjectIndex !== null) {
          if(state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[
            action.payload.subjectIndex
          ].allocateChildId !== undefined && state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[
            action.payload.subjectIndex
          ].allocateChildId !== null){
            state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
              state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[
                action.payload.subjectIndex
              ].allocateChildId
            ].compulsoryCredits -=
              state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[
                action.payload.subjectIndex
              ].credits;
          }
        
        }
        state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
          action.payload.subject.allocateChildId
        ].compulsoryCredits += action.payload.subject.credits;
      }
    },
    updateViewedFieldCredits: (state, action) => {
      state.viewedAllowcatedFields[action.payload].compulsoryCredits =
        state.viewedAllowcatedFields[action.payload].smallField.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.compulsoryCredits,
          0
        );
      state.viewedAllowcatedFields[action.payload].electiveCredits =
        state.viewedAllowcatedFields[action.payload].smallField.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.electiveCredits,
          0
        );
    },
    updateViewedSmallFieldCreditsWithDelete: (state, action) => {
      if (action.payload.type === "compulsory")
        if(state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[
          action.payload.subjectIndex
        ].allocateChildId !== undefined && state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[
          action.payload.subjectIndex
        ].allocateChildId !== null){
 
          state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
            state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[
              action.payload.subjectIndex
            ].allocateChildId
          ].compulsoryCredits -=
            state.viewedAllowcatedFields[action.payload.fieldIndex].subjectList[
              action.payload.subjectIndex
            ].credits;
        }
       
    },
    updateViewedSmallFieldElectiveCredits: (state, action) => {
 
      if (action.payload.groupIndex !== null) {
        state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
          state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList[
            action.payload.groupIndex
          ].allocateChildId
        ].electiveCredits -=
          state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList[
            action.payload.groupIndex
          ].credit;
      }
      state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
        action.payload.groupData.allocateChildId
      ].electiveCredits += action.payload.groupData.credit;

  },
  updateViewedSmallFieldElectiveCreditsWithDelete:(state, action) => {
    if(state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList[
      action.payload.groupIndex
    ].allocateChildId !== undefined && state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList[
      action.payload.groupIndex
    ].allocateChildId !== null){
      state.viewedAllowcatedFields[action.payload.fieldIndex].smallField[
        state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList[
          action.payload.groupIndex
        ].allocateChildId
      ].electiveCredits -= 
      state.viewedAllowcatedFields[action.payload.fieldIndex].electiveSubjectList[
        action.payload.groupIndex
      ].credit
    }
  
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
  updateAllowcateSubjectListSemester,
  updateViewedSmallFieldCompulsoryCredits,
  updateViewedFieldCredits,
  updateViewedSmallFieldCreditsWithDelete,
  updateViewedSmallFieldElectiveCredits,
  updateViewedSmallFieldElectiveCreditsWithDelete
} = allowcateSlice.actions;
export default allowcateSlice.reducer;
