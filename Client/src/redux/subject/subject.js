import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { tempJWTToken } from "../../util/api/host";
import { getAllowcateByIdAPI } from "../../util/api/allowcate/allowcateApi";
import { getAllSubjectAPI } from "../../util/api/subjects/subjectsApi";

const initialState = {
    loading: false,
    importedSubjectsList: [],
    allSubjectList: []
};
export const getAllSubject = createAsyncThunk(
    'subject/getAllSubject',
    async (data) => {
      try {
        let res = await axios.get(getAllSubjectAPI("isCompulsory",data),{
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

export const subjectSlice = createSlice({
    name: "subject",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllSubject.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllSubject.fulfilled, (state, action) => {
          state.allSubjectList = action.payload.data.map((subject) => {
            return {
              ...subject,
              key:subject._id
            }
          })
          state.loading = false
        })
        builder.addCase(getAllSubject.rejected, (state) => {
            state.loading = false
        })
    },
    reducers: {
       updateAfterImportBootcamp: (state,action) => {
        state.importedSubjectsList = action.payload
       },
       updateWithNormalImportSubject: (state,action) => {
        state.importedSubjectsList.push(action.payload)
       },
       removeImportedSubject: (state,action) => {
        const index = state.importedSubjectsList.findIndex(subject => subject._id === action.payload)
        state.importedSubjectsList.splice(index, 1)
       }
    }
})
export const {
    updateAfterImportBootcamp,
    updateWithNormalImportSubject,
    removeImportedSubject
} = subjectSlice.actions;
export default subjectSlice.reducer;