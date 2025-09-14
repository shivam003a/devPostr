import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice.js'
import dashboardReducer from './slices/dashboard.slice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer
    }
})