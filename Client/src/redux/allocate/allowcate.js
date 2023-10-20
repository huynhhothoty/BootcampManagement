import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { tempJWTToken } from "../../util/api/host";
import { getAllowcateByIdAPI } from "../../util/api/allowcate/allowcateApi";
import { USER_TOKEN } from "../../util/constants/sectionStorageKey";

const initialState = {
    loading: false,
    importedFields: []
};
export const getAllowcatById = createAsyncThunk(
    'allowcate/getAllowcatById',
    async (allowcateId) => {
      try {
        const userToken = sessionStorage.getItem(USER_TOKEN)
        let res = await axios.get(getAllowcateByIdAPI(allowcateId),{
          headers:{
            'Authorization': `Bearer ${userToken}`,
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