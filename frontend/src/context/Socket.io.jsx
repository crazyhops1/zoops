import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socketInitialState = {
  socket: null
};

const socketSlice = createSlice({
  name: "socket",
  initialState: socketInitialState,
  reducers: {
    connectSocket: (state) => {
      if (!state.socket) {
        const socket = io(import.meta.env.VITE_BACKENDURL, {
          withCredentials: true,
          query: { userid: localStorage.getItem("id") },
        });

        // ✅ log connection
        socket.on("connect", () => {
          console.log("Socket connected with id:", socket.id);
        });

        state.socket = socket;
      }
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
