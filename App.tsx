import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {NativeBaseProvider, extendTheme} from 'native-base';
import {QueryClientProvider, QueryClient} from 'react-query';

import {AuthContextProvider} from './context/AuthContext';
import Router from './views/Router';

const queryClient = new QueryClient();

function App() {
  const newColorTheme = {
    success: {
      900: '#8287af',
      800: '#7c83db',
      700: '#b3bef6',
    },
  };

  const config = {
    dependencies: {
      'linear-gradient': LinearGradient,
    },
  };

  const theme = extendTheme({colors: newColorTheme});

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <NativeBaseProvider config={config} theme={theme}>
          <Router />
        </NativeBaseProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
