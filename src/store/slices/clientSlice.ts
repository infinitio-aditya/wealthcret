import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProspectAssociation } from '../../types/backend/prospect';

interface ClientState {
    clients: ProspectAssociation[];
    selectedClient: ProspectAssociation | null;
    loading: boolean;
    searchQuery: string;
    filters: {
        status?: 'active' | 'inactive' | 'pending';
        assignedSP?: string;
    };
    page: number;
    hasMore: boolean;
}

const initialState: ClientState = {
    clients: [],
    selectedClient: null,
    loading: false,
    searchQuery: '',
    filters: {},
    page: 1,
    hasMore: true,
};

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setClients: (state, action: PayloadAction<ProspectAssociation[]>) => {
            state.clients = action.payload;
        },
        appendClients: (state, action: PayloadAction<ProspectAssociation[]>) => {
            state.clients = [...state.clients, ...action.payload];
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },
        setSelectedClient: (state, action: PayloadAction<ProspectAssociation | null>) => {
            state.selectedClient = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<ClientState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {};
            state.searchQuery = '';
        },
    },
});

export const {
    setClients,
    appendClients,
    setPage,
    setHasMore,
    setSelectedClient,
    setLoading,
    setSearchQuery,
    setFilters,
    clearFilters,
} = clientSlice.actions;
export default clientSlice.reducer;
