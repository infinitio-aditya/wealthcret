import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import clientReducer from './slices/clientSlice';

// RTK Query API Slices
import { authApi } from '../app/services/authApi';
import { dashboardApi } from '../app/services/dashboardApi';
import { systemApi } from '../app/services/systemApi';
import { documentsApi } from '../app/services/documentsApi';
import { complianceApi } from '../app/services/complianceApi';
import { userServicesApi } from '../app/services/userServicesApi';
import { supportApi } from '../app/services/supportApi';
import { activityApi } from '../app/services/activityApi';

export const store = configureStore({
    reducer: {
        // Traditional Redux slices
        auth: authReducer,
        theme: themeReducer,
        client: clientReducer,

        // RTK Query API slices
        [authApi.reducerPath]: authApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [systemApi.reducerPath]: systemApi.reducer,
        [documentsApi.reducerPath]: documentsApi.reducer,
        [complianceApi.reducerPath]: complianceApi.reducer,
        [userServicesApi.reducerPath]: userServicesApi.reducer,
        [supportApi.reducerPath]: supportApi.reducer,
        [activityApi.reducerPath]: activityApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat([
            authApi.middleware,
            dashboardApi.middleware,
            systemApi.middleware,
            documentsApi.middleware,
            complianceApi.middleware,
            userServicesApi.middleware,
            supportApi.middleware,
            activityApi.middleware,
        ]),
});

// Setup listeners for RTK Query features (like auto-polling)
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
