import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const api = "https://reactnd-books-api.udacity.com";

// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token;
if (!token) token = localStorage.token = Math.random().toString(36).substr(-8);
const headers = {
  Accept: "application/json",
  Authorization: token,
};

//////////////////////////////////createAsyncThunk//////////////////////////////////////

/********Get myBooks*********/
export const MyBooks = createAsyncThunk(
  "api/fetchMyBooks",
  async (_, thunkAPI) => {
    const { rejectedWithValue, getState } = thunkAPI;
    const { currentlyReading } = getState().books;
    try {
      const res = await fetch(`${api}/books`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      return { data, currentlyReading };
    } catch (error) {
      return rejectedWithValue(error);
    }
  }
);

/********Search*********/
export const search = createAsyncThunk(
  "api/fetchBooks",
  async (data, thunkAPI) => {
    const { query, maxResults } = data;
    const { rejectedWithValue } = thunkAPI;
    try {
      const res = await fetch(`${api}/search`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, maxResults }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectedWithValue(error);
    }
  }
);
/////////////////////////////////////GLOBAL State///////////////////////////////////////////
const initialState = { loading: false, myBooks: [], apiBooks: [] };
export const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    clear: (state) => {
      state.apiBooks = [];
      console.log("clear");
    },
  },
  extraReducers: {
    ///////////////////////myBooks///////////////////////////////////
    [MyBooks.pending]: (state) => {
      state.loading = true;
    },
    [MyBooks.fulfilled]: (state, action) => {
      state.loading = false;
      state.myBooks = action.payload;
    },
    [MyBooks.rejected]: (state, action) => {
      state.loading = false;
      console.log("field");
    },
    ///////////////////////////search//////////////////////////////////////////
    [search.pending]: (state) => {
      state.loading = true;
    },
    [search.fulfilled]: (state, action) => {
      state.loading = false;
      const data = action.payload.books.filter((el) => el.imageLinks.thumbnail);
      state.apiBooks = {books: data };
    },
    [search.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { clear } = apiSlice.actions;
export default apiSlice.reducer;