import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client } from '../../types';

interface ClientState {
    clients: Client[];
    selectedClient: Client | null;
    loading: boolean;
    searchQuery: string;
    filters: {
        status?: 'active' | 'inactive' | 'pending';
        assignedSP?: string;
    };
}

const initialState: ClientState = {
    clients: [],
    selectedClient: null,
    loading: false,
    searchQuery: '',
    filters: {},
};

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setClients: (state, action: PayloadAction<Client[]>) => {
            state.clients = action.payload;
        },
        setSelectedClient: (state, action: PayloadAction<Client | null>) => {
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
    setSelectedClient,
    setLoading,
    setSearchQuery,
    setFilters,
    clearFilters,
} = clientSlice.actions;
export default clientSlice.reducer;
