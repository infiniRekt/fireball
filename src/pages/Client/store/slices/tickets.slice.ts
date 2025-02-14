import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ClientTicket } from '../../models';

export interface TicketsState {
  tickets: {
    data: ClientTicket[];
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
  };
  isInitialTicketsLoading: boolean;
}

const initialState: TicketsState = {
  tickets: {
    data: [],
    isLoading: false,
    isLoaded: false,
    isError: false
  },
  isInitialTicketsLoading: true
};

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    loadTickets: (state): void => {
      state.tickets = {
        ...state.tickets,
        isLoading: true,
        isLoaded: false,
        isError: false
      };
    },
    loadTicketsSucceded: (state, action: PayloadAction<ClientTicket[]>): void => {
      state.tickets = {
        data: action.payload,
        isLoading: false,
        isLoaded: true,
        isError: false
      };
    },
    loadTicketsFailed: (state): void => {
      state.tickets = {
        ...state.tickets,
        isLoading: false,
        isLoaded: true,
        isError: true
      };
    },
    setIsInitialTicketsLoading: (state, action: PayloadAction<boolean>): void => {
      state.isInitialTicketsLoading = action.payload;
    }
  }
});

export const { loadTickets, loadTicketsSucceded, loadTicketsFailed, setIsInitialTicketsLoading } = ticketsSlice.actions;

export const ticketsReducer = ticketsSlice.reducer;
