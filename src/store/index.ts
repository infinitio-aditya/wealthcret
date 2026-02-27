import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import clientReducer from './slices/clientSlice';
import { authApi } from '../services/backend/authApi';
import { userServicesApi } from '../services/backend/userServicesApi';
import { onboardingApi } from '../services/backend/onboardingApi';
import { prospectApi } from '../services/backend/prospectApi';
import { documentsApi } from '../services/backend/documentsApi';
import { supportApi } from '../services/backend/supportApi';
import { dashboardApi } from '../services/backend/dashboardApi';
import { newsApi } from '../services/backend/newsApi';
import { rolesApi } from '../services/backend/rolesApi';
import { adminApi } from '../services/backend/adminApi';
import { nomineeApi } from '../services/backend/nomineeApi';
import { complianceApi } from '../services/backend/complianceApi';
import { commissionApi } from '../services/backend/commissionApi';
import { notificationApi } from '../services/backend/notificationApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        client: clientReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userServicesApi.reducerPath]: userServicesApi.reducer,
        [onboardingApi.reducerPath]: onboardingApi.reducer,
        [prospectApi.reducerPath]: prospectApi.reducer,
        [documentsApi.reducerPath]: documentsApi.reducer,
        [supportApi.reducerPath]: supportApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [nomineeApi.reducerPath]: nomineeApi.reducer,
        [complianceApi.reducerPath]: complianceApi.reducer,
        [commissionApi.reducerPath]: commissionApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            authApi.middleware,
            userServicesApi.middleware,
            onboardingApi.middleware,
            prospectApi.middleware,
            documentsApi.middleware,
            supportApi.middleware,
            dashboardApi.middleware,
            newsApi.middleware,
            rolesApi.middleware,
            adminApi.middleware,
            nomineeApi.middleware,
            complianceApi.middleware,
            commissionApi.middleware,
            notificationApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
