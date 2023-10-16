import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBootcampAPI } from "../../util/api/bootcamp/bootcampApi";
import { tempJWTToken } from "../../util/api/host";
import axios from "axios"
import { createFieldAPI } from "../../util/api/allowcate/allowcateApi";
import { createSubjectAPI } from "../../util/api/subjects/subjectsApi";

const initialState = {
  bootcampName: '',
  totalCredits: 0,
  completeTotalCredits: 0,
  allowcateFields: [],
  semesterSubjectList: [],
  semesterList: [[]]
};

export const createSubject = createAsyncThunk(
  'createBootcamp/createSubject',
  async (subjectData) => {
    try {
      let res = await axios.post(createSubjectAPI,subjectData,{
        headers:{
          'Authorization': `Bearer ${tempJWTToken}`,
          'Content-Type': 'application/json',
        },
      }) 
      return res.data
    } catch (error) {
      console.log(error)
      return error
    }
  }
)

export const createFirstBootcamp = createAsyncThunk(
  'createBootcamp/createFirstBootcamp',
  async (bootcampData) => {
    try {
      let res = await axios.post(createBootcampAPI,bootcampData,{
        headers:{
          'Authorization': `Bearer ${tempJWTToken}`,
          'Content-Type': 'application/json',
        },
      }) 
      return res.data
    } catch (error) {
      console.log(error)
      return error
    }
  }
)

export const createField = createAsyncThunk(
  'createBootcamp/createField',
  async (fieldData) => {
    try {
      let res = await axios.post(createFieldAPI,fieldData,{
        headers:{
          'Authorization': `Bearer ${tempJWTToken}`,
          'Content-Type': 'application/json',
        },
      }) 
      return res.data
    } catch (error) {
      console.log(error)
      return error
    }
  }
)

export const createBootcampSlice = createSlice({
  name: "creatBootcamp",
  initialState,
  reducers: {

    updateTotalCredits: (state, action) => {
      state.totalCredits = action.payload;
    },
    updateBootcampName: (state, action) => {
      state.bootcampName = action.payload;
    },
    updateCompulsoryCredit: (state, action) => {
      state.allowcateFields[action.payload.bigFieldIndex].smallField[
        action.payload.smallFieldIndex
      ].compulsoryCredits = action.payload.credits;

      let tempCredits = 0;
      state.allowcateFields[action.payload.bigFieldIndex].smallField.forEach(
        (field) => {
          tempCredits += field.compulsoryCredits;
        }
      );
      state.allowcateFields[action.payload.bigFieldIndex].compulsoryCredits =
        tempCredits;
    },
    updateElectiveCredit: (state, action) => {
      state.allowcateFields[action.payload.bigFieldIndex].smallField[
        action.payload.smallFieldIndex
      ].electiveCredits = action.payload.credits;

      let tempCredits = 0;
      state.allowcateFields[action.payload.bigFieldIndex].smallField.forEach(
        (field) => {
          tempCredits += field.electiveCredits;
        }
      );
      state.allowcateFields[action.payload.bigFieldIndex].electiveCredits =
        tempCredits;
    },

    addBigField: (state) => {
      const newField = {
        fieldName: "",
        compulsoryCredits: 0,
        electiveCredits: 0,
        smallField: [],
        subjectList:[]
      };
      state.allowcateFields.push(newField);
    },

    deleteBigField: (state, action) => {
      state.allowcateFields.splice(action.payload, 1);
    },

    addSmallField: (state, action) => {
      const newChildField = {
        fieldName: "",
        compulsoryCredits: 0,
        electiveCredits: 0,
      };
      state.allowcateFields[action.payload].smallField.push(newChildField);
    },
    deleteSmallField: (state, action) => {
      state.allowcateFields[action.payload.bigFieldIndex].compulsoryCredits -=
        state.allowcateFields[action.payload.bigFieldIndex].smallField[
          action.payload.smallFieldIndex
        ].compulsoryCredits;
      state.allowcateFields[action.payload.bigFieldIndex].electiveCredits -=
        state.allowcateFields[action.payload.bigFieldIndex].smallField[
          action.payload.smallFieldIndex
        ].electiveCredits;
      state.allowcateFields[action.payload.bigFieldIndex].smallField.splice(
        action.payload.smallFieldIndex,
        1
      );
    },

    addSubject: (state, action) => {

      state.allowcateFields[action.payload.fieldIndex].subjectList.push(action.payload.subject)
      state.completeTotalCredits += action.payload.subject.credits
      state.semesterSubjectList.push({
        fieldIndex: action.payload.fieldIndex,
        subjectIndex:  state.allowcateFields[action.payload.fieldIndex].subjectList.length - 1,
        semester: null,
      })
    },
    editSubject: (state, action) => {
      state.allowcateFields[action.payload.fieldIndex].subjectList[action.payload.subjectIndex] = action.payload.subject
    },
    updateCompleteTotalCredits: (state,action) => {
      state.completeTotalCredits = action.payload
    },
    updateBigFieldsName: (state, action) => {
      state.allowcateFields[action.payload.fieldIndex].fieldName = action.payload.fieldName
    },
    updateSmallFieldsName: (state, action) => {
      state.allowcateFields[action.payload.bigFieldIndex].smallField[action.payload.smallFieldIndex].fieldName = action.payload.fieldName
    },
    removeSubject: (state, action) => {
      state.completeTotalCredits -= state.allowcateFields[action.payload.fieldIndex].subjectList[action.payload.subjectIndex].credits
      const index=state.semesterSubjectList.findIndex(subject => subject.fieldIndex === action.payload.fieldIndex && subject.subjectIndex === action.payload.subjectIndex)
      state.semesterSubjectList.splice(index,1)
      state.allowcateFields[action.payload.fieldIndex].subjectList.splice(action.payload.subjectIndex, 1)
    },
    addSubjectsToSemester: (state, action) => {
      action.payload.subjectIndexArr.forEach((subjectIndex) => {
        state.semesterSubjectList[subjectIndex].semester = action.payload.semester
        state.semesterList[action.payload.semester].push({
          ...state.semesterSubjectList[subjectIndex],
          semesterSubjectListIndex:subjectIndex
        })
      })
    
    },
    removeSubjectFromSemester: (state, action) => {
      state.semesterList[action.payload.semesterIndex].splice(action.payload.subjestIndex,1)
      state.semesterSubjectList[action.payload.semesterSubjectListIndex].semester = null
    },
    addSemester: (state, action) => {
      state.semesterList.push([])
    },
    deleteSemester: (state, action) => {
     
      state.semesterSubjectList = state.semesterSubjectList.map((subject) => {
        if(subject.semester === action.payload){
          subject.semester = null
        } else {
          if(subject.semester > action.payload){
            subject.semester--
          }
        }
        return subject
      })
      state.semesterList.splice(action.payload,1)

    },
    resetAll: (state) => {
      state.totalCredits= 0
      state.completeTotalCredits= 0,
      state.allowcateFields= [],
      state.semesterSubjectList= [],
      state.semesterList= [[]]
      state.bootcampName=""
    },
    importBootcamp: (state,action) => {
      state.totalCredits = action.payload.totalCredits
      state.completeTotalCredits = action.payload.completeTotalCredits
      state.allowcateFields = action.payload.allowcateFields
      state.semesterSubjectList = action.payload.semesterSubjectList
      state.semesterList = action.payload.semesterList
      state.bootcampName = action.payload.bootcampName
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  updateTotalCredits,
  updateCompulsoryCredit,
  updateElectiveCredit,
  addBigField,
  addSmallField,
  deleteBigField,
  deleteSmallField,
  addSubject,
  updateCompleteTotalCredits,
  updateBigFieldsName,
  updateSmallFieldsName,
  removeSubject,
  addSubjectsToSemester,
  removeSubjectFromSemester,
  addSemester,
  deleteSemester,
  updateBootcampName,
  editSubject,
  resetAll,
  importBootcamp
} = createBootcampSlice.actions;

export default createBootcampSlice.reducer;
