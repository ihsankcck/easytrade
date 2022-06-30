import React from 'react';
import {QueryClientProvider, QueryClient} from 'react-query';

export const queryClient = new QueryClient();

export const QueryContextProvider = ({children}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
