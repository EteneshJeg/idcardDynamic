import { createSlice } from "@reduxjs/toolkit";

const menuSlice=createSlice({
    name:'menu',
    initialState:{
        isMenuOpen:false,
    },
    reducers:{
        
        toggleMenu:(state)=>{
            state.isMenuOpen=!state.isMenuOpen;
        }
        
    }
});
export default menuSlice.reducer;
export const {toggleMenu}=menuSlice.actions; 