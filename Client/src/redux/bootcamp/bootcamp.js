import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { tempJWTToken } from "../../util/api/host";
import { getAllBootcampAPI } from "../../util/api/bootcamp/bootcampApi";

const initialState = {
    bootcampList: [],
    loading: false
};

export const getAllBootcamp = createAsyncThunk(
    'bootcamp/getAllBootcamp',
    async () => {
      try {
        let res = await axios.get(getAllBootcampAPI("2023"),{
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

export const bootcampSlice = createSlice({
    name: "bootcamp",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllBootcamp.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getAllBootcamp.fulfilled, (state, action) => {
          state.bootcampList = action.payload.data.map((bootcamp) => {
            return {
              ...bootcamp,
              key:bootcamp._id
            }
          })
          state.loading = false
        })
        builder.addCase(getAllBootcamp.rejected, (state, action) => {
            state.loading = false
        })
    },
    reducers: {
       
    }
})
export const {} = bootcampSlice.actions;
export default bootcampSlice.reducer;