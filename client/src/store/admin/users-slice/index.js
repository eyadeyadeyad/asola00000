import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  userList: [],
};

export const getAllUsers = createAsyncThunk(
  "/users/getAllUsers",
  async () => {
    const result = await axios.get(
      "http://localhost:3002/api/admin/users/get"
    );

    return result?.data;
  }
);

export const banUser = createAsyncThunk(
  "/users/banUser",
  async (userId) => {
    const result = await axios.put(
      `http://localhost:3002/api/admin/users/ban/${userId}`
    );

    return result?.data;
  }
);

export const unbanUser = createAsyncThunk(
  "/users/unbanUser",
  async (userId) => {
    const result = await axios.put(
      `http://localhost:3002/api/admin/users/unban/${userId}`
    );

    return result?.data;
  }
);

const AdminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.userList = [];
      });
  },
});

export default AdminUsersSlice.reducer;