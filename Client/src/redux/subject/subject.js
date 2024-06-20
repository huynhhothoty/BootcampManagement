import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { tempJWTToken } from "../../util/api/host";
import { getAllowcateByIdAPI } from "../../util/api/allowcate/allowcateApi";
import { deleteSubjectAPI, getAllSubjectAPI, updateSubjectAPI, querySubjectAPI } from "../../util/api/subjects/subjectsApi";
import { USER_TOKEN } from "../../util/constants/sectionStorageKey";

const initialState = {
  loading: false,
  importedSubjectsList: [],
  allSubjectList: [],
  viewedSubjectList: [],
  viewedSemesterList: [],
  viewedSemesterSubjectList: [],
  checkSubjectList: [],
  checkElecttivSubjectList: []
};
export const getAllSubject = createAsyncThunk(
  "subject/getAllSubject",
  async (data) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(getAllSubjectAPI("isCompulsory", data), {
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
export const updateSubject = createAsyncThunk(
  "subject/updatesubject",
  async ({subjectID,updatedData}) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.patch(updateSubjectAPI(subjectID),updatedData, {
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

export const querySubject = createAsyncThunk(
  "subject/querySubject",
  async (query) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.get(querySubjectAPI(query), {
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

export const deleteSubject = createAsyncThunk(
  "subject/deleteSubject",
  async (subjectId) => {
    try {
      const userToken = sessionStorage.getItem(USER_TOKEN);
      let res = await axios.delete(deleteSubjectAPI(subjectId), {
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


export const subjectSlice = createSlice({
  name: "subject",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllSubject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllSubject.fulfilled, (state, action) => {
      state.allSubjectList = action.payload.data.map((subject) => {
        return {
          ...subject,
          key: subject._id,
        };
      });
      state.loading = false;
    });
    builder.addCase(getAllSubject.rejected, (state) => {
      state.loading = false;
    });
  },
  reducers: {
    updateAfterImportBootcamp: (state, action) => {
      state.importedSubjectsList = []
      state.importedSubjectsList = action.payload;
    },
    updateWithNormalImportSubject: (state, action) => {
      state.importedSubjectsList.push(action.payload);
    },
    removeImportedSubject: (state, action) => {
      const index = state.importedSubjectsList.findIndex(
        (subject) => subject._id === action.payload
      );
      if (index !== -1) state.importedSubjectsList.splice(index, 1);
    },

    updateViewedSubjectList: (state, action) => {
      state.allSubjectList = action.payload;
    },
    updateViewedSemesterList: (state, action) => {
      state.viewedSemesterList = action.payload;
    },
    updateViewedSemesterSubjectLis: (state, action) => {
      state.viewedSemesterSubjectList = action.payload;
    },
    addSubjectToViewedSemsterSubjectList: (state, action) => {
      state.viewedSemesterSubjectList.push(action.payload);
    },
    removeSubjectFromRemovedField: (state, action) => {
      state.viewedSemesterList = state.viewedSemesterList.map((subjectList) => {
        return subjectList.filter(
          (subject) => subject.fieldIndex !== action.payload
        );
      });
      state.viewedSemesterList = state.viewedSemesterList.map((subjectList) => {
        return subjectList.map((subject) => {
          if (subject.fieldIndex > action.payload) {
            return {
              ...subject,
              fieldIndex: subject.fieldIndex - 1,
            };
          } else return subject;
        });
      });
      state.viewedSemesterSubjectList = state.viewedSemesterSubjectList.filter(
        (subject) => subject.fieldIndex !== action.payload
      );
      state.viewedSemesterSubjectList = state.viewedSemesterSubjectList.map(
        (subject) => {
          if (subject.fieldIndex > action.payload) {
            return {
              ...subject,
              fieldIndex: subject.fieldIndex - 1,
            };
          } else return subject;
        }
      );
    },
    removeSubjectFromField: (state, action) => {
      let removedItem = state.viewedSemesterSubjectList.find(subject => (subject.fieldIndex === action.payload.fieldIndex && subject.subjectIndex === action.payload.subjectIndex))
      if(removedItem.semester){
        let removedIndex = state.viewedSemesterList[removedItem.semester].findIndex(subject => (subject.fieldIndex === removedItem.fieldIndex && subject.subjectIndex === removedItem.subjectIndex))
        state.viewedSemesterList[removedItem.semester].splice(removedIndex, 1)
      }
      let removedIndex = state.viewedSemesterSubjectList.findIndex(subject => (subject.fieldIndex === removedItem.fieldIndex && subject.subjectIndex === removedItem.subjectIndex))
      state.viewedSemesterSubjectList.splice(removedIndex, 1)
      state.viewedSemesterSubjectList = state.viewedSemesterSubjectList.map((subject,index) => {
        let newSubject = subject
        if(subject.fieldIndex === action.payload.fieldIndex && newSubject.subjectIndex > action.payload.subjectIndex){
        
          if(subject.semester !== null) {
            let subjectSemesterIndex = state.viewedSemesterList[subject.semester].findIndex(s => s.fieldIndex === subject.fieldIndex && s.subjectIndex === subject.subjectIndex)
            state.viewedSemesterList[subject.semester][subjectSemesterIndex].subjectIndex = state.viewedSemesterList[subject.semester][subjectSemesterIndex].subjectIndex - 1
            state.viewedSemesterList[subject.semester][subjectSemesterIndex].semesterSubjectListIndex = index
          }
          return {
            ...subject,
            subjectIndex: subject.subjectIndex - 1
          }
        }
        return subject
      })
      
    },

    addSemesterToViewedSemesterList: (state, action) => {
      state.viewedSemesterList.push([]);
    },
    deleteSemesterFromViewedSemesterList: (state, action) => {
      state.viewedSemesterList.splice(action.payload, 1);
      state.viewedSemesterList.map((subjectList, semesterIndex) => {
        return subjectList.map((subject) => {
          return {
            ...subject,
            semester: semesterIndex,
          };
        });
      });
      state.viewedSemesterSubjectList = state.viewedSemesterSubjectList.map(
        (subject) => {
          if (subject.semester === action.payload) {
            return {
              ...subject,
              semester: null,
            };
          } else if (subject.semester > action.payload) {
            return {
              ...subject,
              semester: subject.semester - 1,
            };
          } else return subject;
        }
      );
    },
    addSubjectToViewedSemster: (state, action) => {
      action.payload.forEach((subject) => {
        state.viewedSemesterSubjectList[
          subject.semesterSubjectListIndex
        ].semester = subject.semester;
        state.viewedSemesterList[subject.semester].push(subject);
      });
    },
    deleteSubjectFromViewedSemster: (state, action) => {
      const { semester, inSemesterSubjectIndex, fieldIndex, subjectIndex } =
        action.payload;
      state.viewedSemesterList[semester].splice(inSemesterSubjectIndex, 1);
      const tempIndex = state.viewedSemesterSubjectList.findIndex(
        (subject) =>
          subject.fieldIndex === fieldIndex &&
          subject.subjectIndex === subjectIndex &&
          subject.semester === semester
      );
      state.viewedSemesterSubjectList[tempIndex].semester = null
    },

    dragSortSemester: (state,action) => {
      state.viewedSemesterList = action.payload.newSemesterList
      state.viewedSemesterSubjectList = action.payload.newViewedSemesterSubjectList

    },
    initCheckSubjectList: (state, action) => {
      state.checkSubjectList = action.payload
    },
    updateSubjectCheckStatus: (state, action) => {
      state.checkSubjectList[action.payload.subjectIndex].check = action.payload.check
    },
    initCheckElectiveSubjectList: (state,action)=> {
      state.checkElecttivSubjectList = action.payload
    },
    updateCheckElectiveSubjectList: (state,action)=> {
      state.checkElecttivSubjectList = action.payload
    },
    updateSubjectTeacherList: (state,action) => {
      state.checkSubjectList[action.payload.subjectIndex].teachers = action.payload.teachers
    },
    updateSubjectNote: (state, action) => {
      state.checkSubjectList[action.payload.subjectIndex].note = action.payload.note
      console.log(state.checkSubjectList[action.payload.subjectIndex].note)
    }
  },
});
export const {
  updateAfterImportBootcamp,
  updateWithNormalImportSubject,
  removeImportedSubject,
  updateViewedSubjectList,
  updateViewedSemesterList,
  updateViewedSemesterSubjectLis,
  addSubjectToViewedSemsterSubjectList,
  removeSubjectFromRemovedField,
  removeSubjectFromField,
  addSemesterToViewedSemesterList,
  deleteSemesterFromViewedSemesterList,
  addSubjectToViewedSemster,
  deleteSubjectFromViewedSemster,
  dragSortSemester,
  initCheckSubjectList,
  updateSubjectCheckStatus,
  initCheckElectiveSubjectList,
  updateCheckElectiveSubjectList,
  updateSubjectTeacherList,
  updateSubjectNote
} = subjectSlice.actions;
export default subjectSlice.reducer;
