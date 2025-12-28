import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
