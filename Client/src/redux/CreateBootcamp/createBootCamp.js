import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBootcampAPI } from "../../util/api/bootcamp/bootcampApi";
import { tempJWTToken } from "../../util/api/host";
import axios from "axios";
import { createFieldAPI } from "../../util/api/allowcate/allowcateApi";
import { createSubjectAPI } from "../../util/api/subjects/subjectsApi";
import {
  createDraftAPI,
  deleteDraftAPI,
  getDraftByUserAPI,
  updateDraftAPI,
} from "../../util/api/draft/draftApi";
import { USER_TOKEN } from "../../util/constants/sectionStorageKey";

const initialState = {
  bootcampName: "",
  totalCredits: 0,
  completeTotalCredits: 0,
  allowcateFields: [],
  semesterSubjectList: [],
  semesterList: [[]],
  draftID: "",
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
        electiveSubjectList: []
      };
      state.allowcateFields.push(newField);
    },

    deleteBigField: (state, action) => {
      state.completeTotalCredits -=
        state.allowcateFields[action.payload].electiveCredits;
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
      if (action.payload.subject.isCompulsory) {
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
      const index = state.semesterSubjectList.findIndex(
        (subject) =>
          subject.fieldIndex === action.payload.fieldIndex &&
          subject.subjectIndex === action.payload.subjectIndex
      );

      if (state.semesterSubjectList[index].semester !== null) {
        let subjectInSemesterIndex = state.semesterList[
          state.semesterSubjectList[index].semester
        ].findIndex((subject) => subject.semesterSubjectListIndex === index);
        state.semesterList[state.semesterSubjectList[index].semester].splice(
          subjectInSemesterIndex,
          1
        );
      }
      state.semesterSubjectList = state.semesterSubjectList.map((subject) => {
        const newSubject = subject;
        if (
          newSubject.subjectIndex >
          state.semesterSubjectList[index].subjectIndex
        )
          newSubject.subjectIndex -= 1;
        return newSubject;
      });
      state.semesterSubjectList.splice(index, 1);
      state.allowcateFields[action.payload.fieldIndex].subjectList.splice(
        action.payload.subjectIndex,
        1
      );
    },
    addSubjectsToSemester: (state, action) => {
      action.payload.forEach((subject) => {
        state.semesterSubjectList[
          subject.semesterSubjectListIndex
        ].semester = subject.semester;
        state.semesterList[subject.semester].push(subject);
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
        (state.allowcateFields = []),
        (state.semesterSubjectList = []),
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

      state.totalCredits = action.payload.totalCredits;
      state.completeTotalCredits = action.payload.completeTotalCredits;
      state.allowcateFields = action.payload.allowcateFields;
      state.semesterSubjectList = action.payload.semesterSubjectList;
      state.semesterList = action.payload.semesterList;
      state.bootcampName = action.payload.bootcampName;
    },
    addNewGroup: (state,action) => {
      state.allowcateFields[action.payload.fieldIndex].electiveSubjectList.push(action.payload.groupData)
    },
    editGroup: (state,action) => {
      state.allowcateFields[action.payload.fieldIndex].electiveSubjectList[action.payload.groupIndex] = action.payload.groupData
    },
    deleteGroup: (state,action) => {
      state.allowcateFields[action.payload.fieldIndex].electiveSubjectList.splice(action.payload.groupIndex,1)
    },
    editSubjectBranchMajor: (state, action) => {
      state.allowcateFields[action.payload.fieldIndex].subjectList[
        action.payload.subjectIndex
      ] = action.payload.subject;
      console.log(state.allowcateFields[action.payload.fieldIndex].subjectList[
        action.payload.subjectIndex
      ])
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
  editSubjectBranchMajor
} = createBootcampSlice.actions;

export default createBootcampSlice.reducer;
