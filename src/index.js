import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { OrganizationProvider } from './context/OrganizationContext';
import { AuthProvider } from './context/AuthContext';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// Get a reference to the root container element
const container = document.getElementById('root');

// Create a React 18 root using createRoot
const root = ReactDOM.createRoot(container);

// Render your application wrapped with the necessary providers and router
root.render(
  <React.StrictMode>
     <AuthProvider>
    <OrganizationProvider>
     <BrowserRouter>
     <App />
     </BrowserRouter>
     </OrganizationProvider>
     </AuthProvider>
  </React.StrictMode>
);

// Optionally, export an unmount function if needed in your app
export function unmountApp() {
  root.unmount();
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
