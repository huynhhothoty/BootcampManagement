import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalCredits: 0,
  completeTotalCredits: 12,
  allowcateFields: [
    {
      fieldName: "Big Field 2",
      compulsoryCredits: 32,
      electiveCredits: 10,
      smallField: [
        {
          fieldName: "Small Field 1",
          compulsoryTotalCredits: 10,
          electiveCredits: 3,
        },
        {
          fieldName: "Small Field 2",
          compulsoryTotalCredits: 10,
          electiveCredits: 3,
        },
        {
          fieldName: "Small Field 3",
          compulsoryTotalCredits: 12,
          electiveCredits: 4,
        },
      ],
      subjectList: [
        {
          name:"Toan 1",
          subjectCode: "MATH123123",
          credits: 3,
          isCompulsory: true,
          description: ""
        },
        {
          name:"Toan 2",
          subjectCode: "MATH123123",
          credits: 3,
          isCompulsory: false,
          description: ""
        },
        {
          name:"Toan 3",
          subjectCode: "MATH123123",
          credits: 3,
          isCompulsory: true,
          description: ""
        },
        {
          name:"Toan 4",
          subjectCode: "MATH123123",
          credits: 3,
          isCompulsory: false,
          description: ""
        },
      ]

    },
  ],
  semesterSubjectList: [
    {
      fieldIndex: 0,
      subjectIndex: 0,
      semester: null,
    },
    {
      fieldIndex: 0,
      subjectIndex: 1,
      semester: null,
    },
    {
      fieldIndex: 0,
      subjectIndex: 2,
      semester: null,
    },
    {
      fieldIndex: 0,
      subjectIndex: 3,
      semester: null,
    }
  ],
  semesterList: [[]]
};

export const createBootcampSlice = createSlice({
  name: "creatBootcamp",
  initialState,
  reducers: {
    updateTotalCredits: (state, action) => {
      state.totalCredits = action.payload;
    },
    updateCompulsoryCredit: (state, action) => {
      state.allowcateFields[action.payload.bigFieldIndex].smallField[
        action.payload.smallFieldIndex
      ].compulsoryTotalCredits = action.payload.credits;

      let tempCredits = 0;
      state.allowcateFields[action.payload.bigFieldIndex].smallField.forEach(
        (field) => {
          tempCredits += field.compulsoryTotalCredits;
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
        compulsoryTotalCredits: 0,
        electiveCredits: 0,
      };
      state.allowcateFields[action.payload].smallField.push(newChildField);
    },
    deleteSmallField: (state, action) => {
      state.allowcateFields[action.payload.bigFieldIndex].compulsoryCredits -=
        state.allowcateFields[action.payload.bigFieldIndex].smallField[
          action.payload.smallFieldIndex
        ].compulsoryTotalCredits;
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
  deleteSemester
} = createBootcampSlice.actions;

export default createBootcampSlice.reducer;
