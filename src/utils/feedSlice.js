import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,   // or [] depending on your use case
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeUserFeed: (state, action) => {
            const newFeed=state.filter((user)=>user._id!==action.payload);
            return newFeed;
        },
    },
});

export const { addFeed, removeUserFeed } = feedSlice.actions;
export default feedSlice.reducer;