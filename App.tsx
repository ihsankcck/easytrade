import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {NativeBaseProvider, extendTheme} from 'native-base';

import {AuthContextProvider} from './context/AuthContext';
import {QueryContextProvider} from './context/QueryContext';
import Router from './views/Router';

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
    <QueryContextProvider>
      <AuthContextProvider>
        <NativeBaseProvider config={config} theme={theme}>
          <Router />
        </NativeBaseProvider>
      </AuthContextProvider>
    </QueryContextProvider>
  );
}

export default App;
