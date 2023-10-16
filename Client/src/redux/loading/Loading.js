import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false
};

export const loadingSlice = createSlice({
    name: "creatBootcamp",
    initialState,
    reducers: {
       updateLoading: (state,action) => {
        state.loading = action.payload
       }
    }
})
export const {updateLoading} = loadingSlice.actions;
export default loadingSlice.reducer;