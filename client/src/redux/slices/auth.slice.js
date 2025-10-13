import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../lib/axiosInstance.js'
const storedOtpInfo = localStorage.getItem("otpInfo");
const storedOtpRequired = localStorage.getItem("otpRequired");

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
    try {
        const response = await api.get('/api/auth/check-auth')
        return response?.data?.data
    } catch (e) {
        return thunkAPI.rejectWithValue(e?.response?.data?.message)
    }
})

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
    try {
        const { email, password } = payload
        const response = await api.post('/api/auth/login', { email, password })
        if (response.data.data.navigate === 'verify-otp') {
            return { status: 'otp', data: response?.data?.data }
        }

        return { status: 'success', data: response?.data?.data }

    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
    try {
        const { name, email, password } = payload
        const response = await api.post('/api/auth/register', { name, email, password })

        return { status: 'success', data: response?.data?.data }

    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (payload, thunkAPI) => {
    try {
        const { _id, email, otpCode } = payload
        const response = await api.post('/api/auth/verify-otp', { _id, email, otpCode })

        return response?.data?.data;

    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        const response = await api.post('/api/auth/logout')

        return response.data?.message;
    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

export const changePassword = createAsyncThunk('auth/changePassword', async ({ oldPassword, newPassword }, thunkAPI) => {
    try {
        const response = await api.put('/api/settings/change-password', {
            oldPassword,
            newPassword
        })
        return response?.data?.message
    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

export const changeProfile = createAsyncThunk('auth/changeProfile', async ({ name }, thunkAPI) => {
    try {
        const response = await api.put('/api/settings/change-details', {
            name
        })
        return response?.data?.data
    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async ({ password }, thunkAPI) => {
    try {
        const response = await api.delete('/api/settings/delete-account', {
            data: { password }
        })
        return response?.data?.message
    } catch (e) {
        const message = e?.response?.data?.message || "Something Went Wrong"
        return thunkAPI.rejectWithValue(message)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,
        otpRequired: storedOtpRequired === "true",
        otpInfo: storedOtpInfo ? JSON.parse(storedOtpInfo) : null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            // ✅ checkAuth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                state.loading = false
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
                state.loading = false;
            })

            // ✅ login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                if (action.payload.status === 'success') {
                    state.user = action.payload.data;
                    state.isAuthenticated = true;
                    state.otpRequired = false;
                    state.otpInfo = null

                    localStorage.removeItem("otpInfo");
                    localStorage.removeItem("otpRequired");

                } else if (action.payload.status === 'otp') {
                    state.user = null;
                    state.isAuthenticated = false;
                    state.otpInfo = action.payload.data;
                    state.otpRequired = true;

                    localStorage.setItem("otpInfo", JSON.stringify(action.payload.data));
                    localStorage.setItem("otpRequired", "true");
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
                state.otpRequired = false;
                state.otpInfo = null;

                localStorage.removeItem("otpInfo");
                localStorage.removeItem("otpRequired");
            })

            // ✅ verifyOTP
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = null;
                state.isAuthenticated = false;
                state.otpInfo = action.payload.data;
                state.otpRequired = true;

                localStorage.setItem("otpInfo", JSON.stringify(action.payload.data));
                localStorage.setItem("otpRequired", "true");
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
                state.otpRequired = false;
                state.otpInfo = null;

                localStorage.removeItem("otpInfo");
                localStorage.removeItem("otpRequired");
            })

            // ✅ verifyOTP
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
                state.isAuthenticated = true;
                state.otpRequired = false;
                state.otpInfo = null;
                state.loading = false;

                localStorage.removeItem("otpInfo");
                localStorage.removeItem("otpRequired");
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.user = null;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.loading = false;
            })

            // ✅ logOut
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = null;
                state.error = null;
                state.isAuthenticated = false;
                state.otpInfo = null;
                state.otpRequired = false;
                state.loading = false;

                localStorage.removeItem("otpInfo");
                localStorage.removeItem("otpRequired");
            })
            .addCase(logout.rejected, (state, action) => {
                state.user = null;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.otpInfo = null;
                state.otpRequired = false;
                state.loading = false;

                localStorage.removeItem("otpInfo");
                localStorage.removeItem("otpRequired");
            })

            // ✅ changePassword
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.user = null;
                state.error = null;
                state.isAuthenticated = false;
                state.otpInfo = null;
                state.otpRequired = false;
                state.loading = false;

                localStorage.removeItem("otpInfo");
                localStorage.removeItem("otpRequired");
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.error = action.payload;
                state.otpInfo = null;
                state.otpRequired = false;
                state.loading = false;

                localStorage.removeItem("otpInfo");
                localStorage.removeItem("otpRequired");
            })

            // ✅ changePassword
            .addCase(changeProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(changeProfile.rejected, (state, action) => {
                state.error = action.payload;
            })

            // ✅ delete Account
            .addCase(deleteAccount.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.user = null;
                state.error = null;
                state.isAuthenticated = false;
                state.otpInfo = null;
                state.otpRequired = false;

                localStorage.removeItem("otpInfo");
                localStorage.removeItem("otpRequired");
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.error = action.payload;
            })

    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer