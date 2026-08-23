import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigError } from './components/ConfigError';
import { AuthProvider } from './hooks/useAuth';
import { isSupabaseConfigured } from './lib/supabase';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {isSupabaseConfigured ? (
      <AuthProvider>
        <App />
      </AuthProvider>
    ) : (
      <ConfigError />
    )}
  </React.StrictMode>,
);
