import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { tempJWTToken } from "../../util/api/host";
import { getAllowcateByIdAPI } from "../../util/api/allowcate/allowcateApi";

const initialState = {
    loading: false,
    importedFields: []
};
export const getAllowcatById = createAsyncThunk(
    'allowcate/getAllowcatById',
    async (allowcateId) => {
      try {
        let res = await axios.get(getAllowcateByIdAPI(allowcateId),{
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


export const allowcateSlice = createSlice({
    name: "allocate",
    initialState,
    extraReducers: (builder) => {
      
    },
    reducers: {
       
    }
})
export const {} = allowcateSlice.actions;
export default allowcateSlice.reducer;