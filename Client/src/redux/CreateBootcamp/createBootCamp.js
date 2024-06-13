import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createBootcampAPI,
  createTemplateBootcampAPI,
} from "../../util/api/bootcamp/bootcampApi";
import { tempJWTToken } from "../../util/api/host";
import axios from "axios";
import { createFieldAPI } from "../../util/api/allowcate/allowcateApi";
import { createSubjectAPI } from "../../util/api/subjects/subjectsApi";
import {
  createDraftAPI,
  deleteDraftAPI,
  getDraftByUserAPI,
  queryDraftByUserAPI,
  updateDraftAPI,
} from "../../util/api/draft/draftApi";
import { USER_DATA, USER_TOKEN } from "../../util/constants/sectionStorageKey";

const initialState = {
  bootcampName: "",
  totalCredits: 0,
  completeTotalCredits: 0,
  allowcateFields: [{
    compulsoryCredits: 5,
    electiveCredits: 0,
    electiveSubjectList: [],
    fieldName: 'Physical Education',
    isElectiveNameBaseOnBigField: false,
    smallField: [
      {
        compulsoryCredits: 1,
        electiveCredits: 0,
        fieldName: "Physical Education 1"
      },
      {
        compulsoryCredits: 1,
        electiveCredits: 0,
        fieldName: "Physical Education 2"
      },
      {
        compulsoryCredits: 3,
        electiveCredits: 0,
        fieldName: "Physical Education 3"
      }
    ],
    subjectList: [
      {
        allocateChildId: 0,
        branchMajor: null,
        credits: 1,
        departmentChild: '65f7ed6002b826165690460e',
        description: "None",
        isAutoCreateCode: false,
        isCompulsory:true,
        name: "Physical Education 1",
        semester: 0,
        shortFormName: "MKMK",
        subjectCode: "PHED110513E"
      },
      {
        allocateChildId: 1,
        branchMajor: null,
        credits: 1,
        departmentChild: '65f7ed6002b826165690460e',
        description: "None",
        isAutoCreateCode: false,
        isCompulsory:true,
        name: "Physical Education 2",
        semester: 0,
        shortFormName: "MKMK",
        subjectCode: "PHED110613E"
      },
      {
        allocateChildId: 2,
        branchMajor: null,
        credits: 3,
        departmentChild: '65f7ed6002b826165690460e',
        description: "None",
        isAutoCreateCode: false,
        isCompulsory:true,
        name: "Physical Education 3",
        semester: 0,
        shortFormName: "MKMK",
        subjectCode: "PHED130715E"
      }
    ]
  }],
  semesterSubjectList: [
    {
      fieldIndex: 0,
      semester: null,
      subjectIndex: 0
    },
    {
      fieldIndex: 0,
      semester: null,
      subjectIndex: 1
    },
    {
      fieldIndex: 0,
      semester: null,
      subjectIndex: 2
    }
  ],
  semesterList: [[]],
  draftID: "",
  selectedMajor: "",
  branchMajorSemester: 0,
  draftList: [],
};

export const createSubject = createAsyncThunk(
  "createBootcamp/createSubject",
  async (subjectData) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.post(createSubjectAPI, subjectData, {
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

export const createFirstBootcamp = createAsyncThunk(
  "createBootcamp/createFirstBootcamp",
  async (bootcampData) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.post(createBootcampAPI, bootcampData, {
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

export const createTemplateBootcamp = createAsyncThunk(
  "createBootcamp/createTemplateBootcamp",
  async (bootcampData) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.post(createTemplateBootcampAPI, bootcampData, {
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

export const createField = createAsyncThunk(
  "createBootcamp/createField",
  async (fieldData) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.post(createFieldAPI, fieldData, {
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

export const createDraft = createAsyncThunk(
  "createBootcamp/createDraft",
  async (data) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.post(createDraftAPI, data, {
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

export const updateDraft = createAsyncThunk(
  "createBootcamp/updateDraft",
  async (data) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.patch(updateDraftAPI(data.draftID), data.data, {
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

export const getUserDraft = createAsyncThunk(
  "createBootcamp/getUserDraft",
  async (userID) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(getDraftByUserAPI(userID), {
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
export const queryUserDraft = createAsyncThunk(
  "createBootcamp/queryUserDraft",
  async (query) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let userData = sessionStorage.getItem(USER_DATA);
      userData = JSON.parse(userData);
      let res = await axios.get(queryDraftByUserAPI(userData.id, query), {
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

export const deleteDraft = createAsyncThunk(
  "createBootcamp/deleteDraft",
  async (draftID) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.delete(deleteDraftAPI(draftID), {
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

export const createBootcampSlice = createSlice({
  name: "creatBootcamp",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(createDraft.fulfilled, (state, action) => {
      state.draftID = action.payload.data._id;
    });
    builder.addCase(getUserDraft.fulfilled, (state, action) => {
      if (action.payload.data.length > 0) {
        const {
          allowcateFields,
          bootcampName,
          completeTotalCredits,
          semesterList,
          semesterSubjectList,
          totalCredits,
        } = action.payload.data[0].data;
        state.allowcateFields = allowcateFields;
        state.bootcampName = bootcampName;
        state.completeTotalCredits = completeTotalCredits;
        state.semesterList = semesterList;
        state.semesterSubjectList = semesterSubjectList;
        state.totalCredits = totalCredits;
        state.draftID = action.payload.data[0]._id;
      }
    });
    builder.addCase(deleteDraft.fulfilled, (state, action) => {
      state.draftID = "";
    });

    builder.addCase(queryUserDraft.fulfilled, (state, action) => {
      state.draftList = action.payload.data;
    });
  },
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
      const currentCredits =
        state.allowcateFields[action.payload.bigFieldIndex].electiveCredits;

      state.allowcateFields[action.payload.bigFieldIndex].smallField.forEach(
        (field) => {
          tempCredits += field.electiveCredits;
        }
      );
      state.allowcateFields[action.payload.bigFieldIndex].electiveCredits =
        tempCredits;

      if (
        state.allowcateFields[action.payload.bigFieldIndex].electiveCredits >
        currentCredits
      ) {
        state.completeTotalCredits +=
          state.allowcateFields[action.payload.bigFieldIndex].electiveCredits -
          currentCredits;
      } else if (
        state.allowcateFields[action.payload.bigFieldIndex].electiveCredits <
        currentCredits
      ) {
        state.completeTotalCredits -=
          currentCredits -
          state.allowcateFields[action.payload.bigFieldIndex].electiveCredits;
      }
    },

    addBigField: (state) => {
      const newField = {
        fieldName: "",
        compulsoryCredits: 0,
        electiveCredits: 0,
        smallField: [],
        subjectList: [],
        electiveSubjectList: [],
      };
      
      state.semesterSubjectList = state.semesterSubjectList.map((subject,index) => {
        if(subject.fieldIndex === state.allowcateFields.length - 1){
          if(subject.semester !== null){
            let semesterSubjectIndex = state.semesterList[subject.semester].findIndex(s => s.fieldIndex === subject.fieldIndex && s.subjectIndex === subject.subjectIndex);
            state.semesterList[subject.semester][semesterSubjectIndex].fieldIndex = state.semesterList[subject.semester][semesterSubjectIndex].fieldIndex + 1

          }
          return {
            ...subject,
            fieldIndex: subject.fieldIndex + 1
          }
        }else return subject
      })
      state.allowcateFields.splice(state.allowcateFields.length - 1, 0, newField)
      // state.allowcateFields.push(newField);
    },

    deleteBigField: (state, action) => {
      
      state.semesterSubjectList = state.semesterSubjectList.filter(subject => subject.fieldIndex !== action.payload)
      state.semesterList = state.semesterList.map(semester => semester.filter(s => s.fieldIndex !== action.payload))
      state.semesterSubjectList = state.semesterSubjectList.map((subject,index) => {
        if(subject.semester !== null){
          let semesterSubjectIndex = state.semesterList[subject.semester].findIndex(s => s.fieldIndex === subject.fieldIndex && s.subjectIndex === subject.subjectIndex)
          state.semesterList[subject.semester][semesterSubjectIndex].semesterSubjectListIndex = index
          if(state.semesterList[subject.semester][semesterSubjectIndex].fieldIndex > action.payload)
            state.semesterList[subject.semester][semesterSubjectIndex].fieldIndex = state.semesterList[subject.semester][semesterSubjectIndex].fieldIndex - 1
        }
        if(subject.fieldIndex > action.payload){
          return {
            ...subject,
            fieldIndex: subject.fieldIndex - 1
          }
        }else return subject
      })

      state.completeTotalCredits -=
        state.allowcateFields[action.payload].electiveCredits + state.allowcateFields[action.payload].compulsoryCredits
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
      state.completeTotalCredits -=
        state.allowcateFields[action.payload.bigFieldIndex].smallField[
          action.payload.smallFieldIndex
        ].electiveCredits;

      state.allowcateFields[action.payload.bigFieldIndex].subjectList =
        state.allowcateFields[action.payload.bigFieldIndex].subjectList.map(
          (subject) => {
            if (
              subject.allocateChildId !== undefined &&
              subject.allocateChildId !== null
            ) {
              if (subject.allocateChildId === action.payload.smallFieldIndex)
                return {
                  ...subject,
                  allocateChildId: null,
                };
            }
            return subject;
          }
        );
      state.allowcateFields[action.payload.bigFieldIndex].smallField.splice(
        action.payload.smallFieldIndex,
        1
      );
    },

    addSubject: (state, action) => {
      state.allowcateFields[action.payload.fieldIndex].subjectList.push(
        action.payload.subject
      );
      if (action.payload.type === "Compulsory")
        state.completeTotalCredits += action.payload.subject.credits;
      state.semesterSubjectList.push({
        fieldIndex: action.payload.fieldIndex,
        subjectIndex:
          state.allowcateFields[action.payload.fieldIndex].subjectList.length -
          1,
        semester: null,
      });
    },
    editSubject: (state, action) => {
      if (state.allowcateFields[action.payload.fieldIndex].subjectList[
        action.payload.subjectIndex
      ].isCompulsory && state.allowcateFields[action.payload.fieldIndex].subjectList[
        action.payload.subjectIndex
      ].allocateChildId !== null) {
        state.completeTotalCredits -=
          state.allowcateFields[action.payload.fieldIndex].subjectList[
            action.payload.subjectIndex
          ].credits;
      }
      state.allowcateFields[action.payload.fieldIndex].subjectList[
        action.payload.subjectIndex
      ] = action.payload.subject;

      if (action.payload.subject.isCompulsory) {
        state.completeTotalCredits +=
          state.allowcateFields[action.payload.fieldIndex].subjectList[
            action.payload.subjectIndex
          ].credits;
      }
    },
    updateCompleteTotalCredits: (state, action) => {
      state.completeTotalCredits = action.payload;
    },
    updateBigFieldsName: (state, action) => {
      state.allowcateFields[action.payload.fieldIndex].fieldName =
        action.payload.fieldName;
    },
    updateSmallFieldsName: (state, action) => {
      state.allowcateFields[action.payload.bigFieldIndex].smallField[
        action.payload.smallFieldIndex
      ].fieldName = action.payload.fieldName;
    },
    removeSubject: (state, action) => {
      if (action.payload.type === "Compulsory")
        state.completeTotalCredits -=
          state.allowcateFields[action.payload.fieldIndex].subjectList[
            action.payload.subjectIndex
          ].credits;
      const semesterSubjectListindex = state.semesterSubjectList.findIndex(
        (subject) =>
          subject.fieldIndex === action.payload.fieldIndex &&
          subject.subjectIndex === action.payload.subjectIndex
      );

      // if (state.semesterSubjectList[index].semester !== null) {
      //   let subjectInSemesterIndex = state.semesterList[
      //     state.semesterSubjectList[index].semester
      //   ].findIndex((subject) => subject.semesterSubjectListIndex === index);
      //   state.semesterList[state.semesterSubjectList[index].semester].splice(
      //     subjectInSemesterIndex,
      //     1
      //   );
      // }
      if(state.semesterSubjectList[semesterSubjectListindex].semester !== null){
        let semesterSIndex = state.semesterList[state.semesterSubjectList[semesterSubjectListindex].semester].findIndex(subject => subject.semesterSubjectListIndex === semesterSubjectListindex)
        state.semesterList[state.semesterSubjectList[semesterSubjectListindex].semester].splice(semesterSIndex, 1)
      }
      
      state.semesterSubjectList = state.semesterSubjectList.map((subject,index) => {
        const newSubject = subject;
        if (
          newSubject.fieldIndex === action.payload.fieldIndex &&
          newSubject.subjectIndex > state.semesterSubjectList[semesterSubjectListindex].subjectIndex
        ){
          newSubject.subjectIndex -= 1;
          if(newSubject.semester !== null){
            let semesterSIndex = state.semesterList[subject.semester].findIndex(subject => subject.semesterSubjectListIndex === index)
            state.semesterList[subject.semester][semesterSIndex].subjectIndex = newSubject.subjectIndex
          }
        }
          
        
        if(index > semesterSubjectListindex){
          if(subject.semester !== null){
            let semesterSIndex = state.semesterList[subject.semester].findIndex(subject => subject.semesterSubjectListIndex === index)
            state.semesterList[subject.semester][semesterSIndex].semesterSubjectListIndex = index - 1
          }
        }
        return newSubject;
      });
      
      state.semesterSubjectList.splice(semesterSubjectListindex, 1);
      state.allowcateFields[action.payload.fieldIndex].subjectList.splice(
        action.payload.subjectIndex,
        1
      );
    },
    addSubjectsToSemester: (state, action) => {
      action.payload.forEach((subject) => {
        state.semesterSubjectList[subject.semesterSubjectListIndex].semester =
          subject.semester;
        state.semesterList[subject.semester].push(subject);
        state.allowcateFields[subject.fieldIndex].subjectList[
          subject.subjectIndex
        ]["semester"] = subject.semester;
      });
    },
    removeSubjectFromSemester: (state, action) => {
      state.semesterList[action.payload.semesterIndex].splice(
        action.payload.subjestIndex,
        1
      );
      state.semesterSubjectList[
        action.payload.semesterSubjectListIndex
      ].semester = null;
    },
    addSemester: (state, action) => {
      state.semesterList.push([]);
    },
    deleteSemester: (state, action) => {
      state.semesterSubjectList = state.semesterSubjectList.map((subject) => {
        if (subject.semester === action.payload) {
          subject.semester = null;
        } else {
          if (subject.semester > action.payload) {
            subject.semester--;
          }
        }
        return subject;
      });
      state.semesterList.splice(action.payload, 1);
    },
    resetAll: (state) => {

      state.totalCredits = 0;
      (state.completeTotalCredits = 0),
        (state.allowcateFields = [{
          compulsoryCredits: 5,
          electiveCredits: 0,
          electiveSubjectList: [],
          fieldName: 'Physical Education',
          isElectiveNameBaseOnBigField: false,
          smallField: [
            {
              compulsoryCredits: 1,
              electiveCredits: 0,
              fieldName: "Physical Education 1"
            },
            {
              compulsoryCredits: 1,
              electiveCredits: 0,
              fieldName: "Physical Education 2"
            },
            {
              compulsoryCredits: 3,
              electiveCredits: 0,
              fieldName: "Physical Education 3"
            }
          ],
          subjectList: [
            {
              allocateChildId: 0,
              branchMajor: null,
              credits: 1,
              departmentChild: '65f7ed6002b826165690460e',
              description: "None",
              isAutoCreateCode: false,
              isCompulsory:true,
              name: "Physical Education 1",
              semester: 0,
              shortFormName: "MKMK",
              subjectCode: "PHED110513E"
            },
            {
              allocateChildId: 1,
              branchMajor: null,
              credits: 1,
              departmentChild: '65f7ed6002b826165690460e',
              description: "None",
              isAutoCreateCode: false,
              isCompulsory:true,
              name: "Physical Education 2",
              semester: 0,
              shortFormName: "MKMK",
              subjectCode: "PHED110613E"
            },
            {
              allocateChildId: 2,
              branchMajor: null,
              credits: 3,
              departmentChild: '65f7ed6002b826165690460e',
              description: "None",
              isAutoCreateCode: false,
              isCompulsory:true,
              name: "Physical Education 3",
              semester: 0,
              shortFormName: "MKMK",
              subjectCode: "PHED130715E"
            }
          ]
        }]),
        (state.semesterSubjectList = [
          {
            fieldIndex: 0,
            semester: null,
            subjectIndex: 0
          },
          {
            fieldIndex: 0,
            semester: null,
            subjectIndex: 1
          },
          {
            fieldIndex: 0,
            semester: null,
            subjectIndex: 2
          }
        ]),
        (state.semesterList = [[]]);
      state.bootcampName = "";
    },
    importBootcamp: (state, action) => {
      state.totalCredits = 0;
      state.completeTotalCredits = 0;
      state.allowcateFields = [];
      state.semesterSubjectList = [];
      state.semesterList = [[]];
      state.bootcampName = "";
      state.branchMajorSemester = 0;

      state.totalCredits = action.payload.totalCredits;
      state.completeTotalCredits = action.payload.completeTotalCredits;
      state.allowcateFields = action.payload.allowcateFields;
      state.semesterSubjectList = action.payload.semesterSubjectList;
      state.semesterList = action.payload.semesterList;
      state.bootcampName = action.payload.bootcampName;
      state.branchMajorSemester = action.payload.branchMajorSemester;
    },
    addNewGroup: (state, action) => {
      state.allowcateFields[action.payload.fieldIndex].electiveSubjectList.push(
        action.payload.groupData
      );
      state.completeTotalCredits += action.payload.groupData.credit;
    },
    editGroup: (state, action) => {
      if(state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
        action.payload.groupIndex
      ].allocateChildId !== null){
        state.completeTotalCredits -=
        state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
          action.payload.groupIndex
        ].credit;
      }
      
      state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
        action.payload.groupIndex
      ] = action.payload.groupData;
      state.completeTotalCredits += action.payload.groupData.credit;
    },
    deleteGroup: (state, action) => {
      state.completeTotalCredits -=
        state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
          action.payload.groupIndex
        ].credit;
      state.allowcateFields[
        action.payload.fieldIndex
      ].electiveSubjectList.splice(action.payload.groupIndex, 1);
    },
    editSubjectBranchMajor: (state, action) => {
      state.allowcateFields[action.payload.fieldIndex].subjectList[
        action.payload.subjectIndex
      ] = action.payload.subject;
      console.log(
        state.allowcateFields[action.payload.fieldIndex].subjectList[
          action.payload.subjectIndex
        ]
      );
    },
    updateAutogenSubjectCode: (state, action) => {
      state.allowcateFields = action.payload;
    },
    updateSelectedMajor: (state, action) => {
      state.selectedMajor = action.payload;
    },
    updateBranchMajorSemester: (state, action) => {
      // console.log(state.allowcateFields[0].subjectList[0].branchMajor)
      state.branchMajorSemester = action.payload.newData;
    },
    updateSmallFieldCompulsoryCredits: (state, action) => {
      if (action.payload.subject.isCompulsory) {
        if (action.payload.subjectIndex !== null) {
          if (
            state.allowcateFields[action.payload.fieldIndex].subjectList[
              action.payload.subjectIndex
            ].allocateChildId !== undefined &&
            state.allowcateFields[action.payload.fieldIndex].subjectList[
              action.payload.subjectIndex
            ].allocateChildId !== null
          ) {
            state.allowcateFields[action.payload.fieldIndex].smallField[
              state.allowcateFields[action.payload.fieldIndex].subjectList[
                action.payload.subjectIndex
              ].allocateChildId
            ].compulsoryCredits -=
              state.allowcateFields[action.payload.fieldIndex].subjectList[
                action.payload.subjectIndex
              ].credits;
          }
        }
        state.allowcateFields[action.payload.fieldIndex].smallField[
          action.payload.subject.allocateChildId
        ].compulsoryCredits += action.payload.updateFieldCompulsoryCredits;
      }
    },
    updateFieldCredits: (state, action) => {
      state.allowcateFields[action.payload].compulsoryCredits =
        state.allowcateFields[action.payload].smallField.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.compulsoryCredits,
          0
        );
      state.allowcateFields[action.payload].electiveCredits =
        state.allowcateFields[action.payload].smallField.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.electiveCredits,
          0
        );
    },
    updateSmallFieldCreditsWithDelete: (state, action) => {
      if (action.payload.type === "Compulsory")
        if (
          state.allowcateFields[action.payload.fieldIndex].subjectList[
            action.payload.subjectIndex
          ].allocateChildId !== undefined &&
          state.allowcateFields[action.payload.fieldIndex].subjectList[
            action.payload.subjectIndex
          ].allocateChildId !== null
        ) {
          state.allowcateFields[action.payload.fieldIndex].smallField[
            state.allowcateFields[action.payload.fieldIndex].subjectList[
              action.payload.subjectIndex
            ].allocateChildId
          ].compulsoryCredits -=
            state.allowcateFields[action.payload.fieldIndex].subjectList[
              action.payload.subjectIndex
            ].credits;
        }
    },
    updateSmallFieldElectiveCredits: (state, action) => {
      if (action.payload.groupIndex !== null) {
        if(state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
          action.payload.groupIndex
        ].allocateChildId !== null){
          state.allowcateFields[action.payload.fieldIndex].smallField[
            state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
              action.payload.groupIndex
            ].allocateChildId
          ].electiveCredits -=
            state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
              action.payload.groupIndex
            ].credit;
        }
      
      }
      state.allowcateFields[action.payload.fieldIndex].smallField[
        action.payload.groupData.allocateChildId
      ].electiveCredits += action.payload.groupData.credit;
    },
    updateSmallFieldElectiveCreditsWithDelete: (state, action) => {
      if (
        state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
          action.payload.groupIndex
        ].allocateChildId !== undefined &&
        state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
          action.payload.groupIndex
        ].allocateChildId !== null
      ) {
        state.allowcateFields[action.payload.fieldIndex].smallField[
          state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
            action.payload.groupIndex
          ].allocateChildId
        ].electiveCredits -=
          state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[
            action.payload.groupIndex
          ].credit;
      }
    },
    loadDraft: (state, action) => {
      const {
        allowcateFields,
        bootcampName,
        completeTotalCredits,
        semesterList,
        semesterSubjectList,
        totalCredits,
      } = action.payload.data;
      state.allowcateFields = allowcateFields;
      state.bootcampName = bootcampName;
      state.completeTotalCredits = completeTotalCredits;
      state.semesterList = semesterList;
      state.semesterSubjectList = semesterSubjectList;
      state.totalCredits = totalCredits;
      state.draftID = action.payload._id;
    },
    updateDragData: (state, action) => {
      //fieldIndex, beforeIndex, afterIndex,
      const fieldIndex = action.payload.fieldIndex;
      const beforeIndex = action.payload.beforeIndex;
      const afterIndex = action.payload.afterIndex;
        state.allowcateFields[fieldIndex].subjectList[beforeIndex];
      if (beforeIndex > afterIndex) {
        state.semesterList.map((semester) =>
          semester.map((subject) => {
            if (
              subject.fieldIndex === fieldIndex &&
              subject.subjectIndex > afterIndex &&
              subject.subjectIndex < beforeIndex
            ) {
              return {
                ...subject,
                subjectIndex: subject.subjectIndex + 1,
              };
            }else {
              return subject
            }
          })
        );
        state.semesterSubjectList = state.semesterSubjectList.map((subject) => {
          if (
            subject.fieldIndex === fieldIndex &&
            subject.subjectIndex > afterIndex &&
            subject.subjectIndex < beforeIndex
          ) {
            return {
              ...subject,
              subjectIndex: subject.subjectIndex + 1,
            };
          }else return subject
        })
        
      }else if (beforeIndex < afterIndex){
        state.semesterList.map((semester) =>
          semester.map((subject) => {
            if (
              subject.fieldIndex === fieldIndex &&
              subject.subjectIndex > afterIndex &&
              subject.subjectIndex < beforeIndex
            ) {
              return {
                ...subject,
                subjectIndex: subject.subjectIndex - 1,
              };
            }else {
              return subject
            }
          })
        );
        state.semesterSubjectList = state.semesterSubjectList.map((subject) => {
          if (
            subject.fieldIndex === fieldIndex &&
            subject.subjectIndex > afterIndex &&
            subject.subjectIndex < beforeIndex
          ) {
            return {
              ...subject,
              subjectIndex: subject.subjectIndex - 1,
            };
          }else return subject
        })
      }
      const [movedItem] = state.allowcateFields[fieldIndex].subjectList.splice(beforeIndex, 1)
        state.allowcateFields[fieldIndex].subjectList.splice(afterIndex, 0, movedItem);
    },
    changeUseSmallFieldName: (state,action) => {
      state.allowcateFields[action.payload.fieldIndex]['isElectiveNameBaseOnBigField'] = action.payload.checked
    },
    swapSubject: (state,action) => {
      //subjectIndex, oldFieldIndex, newFieldIndex, newSmallFieldIndex
      const {
        subjectIndex, oldFieldIndex, newFieldIndex, newSmallFieldIndex
      } = action.payload
      let swapedSubjectData = {
        ...state.allowcateFields[oldFieldIndex].subjectList[subjectIndex],
        allocateChildId: newSmallFieldIndex
      }
      state.semesterSubjectList = state.semesterSubjectList.map((subject,index) => {
        if(subject.fieldIndex === oldFieldIndex && subject.subjectIndex > subjectIndex){

          if(subject.semester !== null){
            let subjectSemesterIndex = state.semesterList[subject.semester].findIndex(subject => subject.semesterSubjectListIndex === index)
            state.semesterList[subject.semester][subjectSemesterIndex].subjectIndex =  state.semesterList[subject.semester][subjectSemesterIndex].subjectIndex - 1
          }
          return {
            ...subject,
            subjectIndex: subject.subjectIndex - 1
          }
        }else if(subject.fieldIndex === oldFieldIndex && subject.subjectIndex === subjectIndex){
          if(subject.semester !== null){
            let subjectSemesterIndex = state.semesterList[subject.semester].findIndex(subject => subject.semesterSubjectListIndex === index)
            state.semesterList[subject.semester][subjectSemesterIndex].subjectIndex =  state.allowcateFields[newFieldIndex].subjectList.length
            state.semesterList[subject.semester][subjectSemesterIndex].fieldIndex = newFieldIndex
          }
          return {
            ...subject,
            fieldIndex:  newFieldIndex,
            subjectIndex: state.allowcateFields[newFieldIndex].subjectList.length
          }
        }
        return subject
      })

      state.allowcateFields[oldFieldIndex].subjectList.splice(subjectIndex, 1)
      state.allowcateFields[newFieldIndex].subjectList.push(swapedSubjectData)
    },
    swapSubjectInSemester: (state,action) => {
      const {
        semesterIndex,
        beforeIndex,
        afterIndex
      } = action.payload
      const [movedItem] = state.semesterList[semesterIndex].splice(beforeIndex, 1)
      state.semesterList[semesterIndex].splice(afterIndex, 0, movedItem);
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
  importBootcamp,
  addNewGroup,
  editGroup,
  deleteGroup,
  editSubjectBranchMajor,
  updateAutogenSubjectCode,
  updateSelectedMajor,
  updateBranchMajorSemester,
  updateSmallFieldCompulsoryCredits,
  updateFieldCredits,
  updateSmallFieldCreditsWithDelete,
  updateSmallFieldElectiveCredits,
  updateSmallFieldElectiveCreditsWithDelete,
  loadDraft,
  updateDragData,
  changeUseSmallFieldName,
  swapSubject,
  swapSubjectInSemester
} = createBootcampSlice.actions;

export default createBootcampSlice.reducer;
