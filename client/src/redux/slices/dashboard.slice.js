import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../lib/axiosInstance';

export const getBatches = createAsyncThunk('dashbaord/getBatches', async (_, thunkAPI) => {
    try {
        const response = await api.get('/api/batch')
        return response?.data?.data;

    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong";
        return thunkAPI.rejectWithValue(message)
    }
})

export const getBatchesPosts = createAsyncThunk('dashboard/getBatchesPosts', async (payload, thunkAPI) => {
    try {
        const response = await api.get(`/api/batch/${payload}`)
        return response?.data?.data?.body;
    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

export const generatePosts = createAsyncThunk('dashboard/generatePosts', async (payload, thunkAPI) => {
    try {
        const response = await api.post('/api/generate/prompt', payload)

        return response?.data?.data?.batch;
    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        console.log("error", e)
        return thunkAPI.rejectWithValue(message)
    }
})


const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        loading: true,
        batches: [],
        batchesPosts: [],
        error: null,
        newGeneratedBatch: null
    },
    extraReducers: (builder) => {
        builder

            // getBatches
            .addCase(getBatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBatches.fulfilled, (state, action) => {
                state.batches = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getBatches.rejected, (state, action) => {
                state.batches = [];
                state.error = action.payload;
                state.loading = false;
            })

            // getbatchesPosts
            .addCase(getBatchesPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBatchesPosts.fulfilled, (state, action) => {
                state.batchesPosts = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getBatchesPosts.rejected, (state, action) => {
                state.error = action.payload;
                state.batchesPosts = [];
                state.loading = false;
            })

            // generatePost
            .addCase(generatePosts.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.newGeneratedBatch = null;

            })
            .addCase(generatePosts.fulfilled, (state, action) => {
                state.newGeneratedBatch = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(generatePosts.rejected, (state, action) => {
                state.error = action.payload;
                state.newGeneratedBatch = null;
                state.loading = false;
            })

    }
})

export default dashboardSlice.reducer;